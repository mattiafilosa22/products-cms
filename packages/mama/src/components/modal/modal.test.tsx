import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import { describe, expect, it, vi } from "vitest";
import { useModalContext } from "./modal-context";
import { Modal } from "./modal";

// Probe component: drives the modal through its public context API.
const ContextProbe = ({
  title,
  confirmLabel,
  onConfirm,
  closeResult,
}: {
  title?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  closeResult?: boolean;
}) => {
  const { setTitle, setConfirmConfig, tryClose } = useModalContext();

  useEffect(() => {
    if (title) setTitle(title);
    if (confirmLabel || onConfirm) {
      setConfirmConfig({
        ...(confirmLabel && { label: confirmLabel }),
        onClick: onConfirm ?? null,
      });
    }
  }, [title, confirmLabel, onConfirm, setTitle, setConfirmConfig]);

  return (
    <div>
      <p>Contenuto modale</p>
      {closeResult !== undefined && (
        <button onClick={() => tryClose(closeResult)}>Chiudi con esito</button>
      )}
    </div>
  );
};

describe("Modal", () => {
  it("è chiusa finché non si clicca il trigger, poi mostra il contenuto", async () => {
    const user = userEvent.setup();
    render(
      <Modal trigger={<button>Apri</button>}>
        <p>Contenuto modale</p>
      </Modal>,
    );

    expect(screen.queryByText("Contenuto modale")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Apri" }));
    expect(screen.getByText("Contenuto modale")).toBeInTheDocument();
    // Footer di default: Annulla + Conferma
    expect(screen.getByRole("button", { name: "Annulla" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Conferma" }),
    ).toBeInTheDocument();
  });

  it("setTitle e setConfirmConfig via context si riflettono nell'UI", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <Modal trigger={<button>Apri</button>}>
        <ContextProbe
          title="Titolo di prova"
          confirmLabel="Elimina"
          onConfirm={onConfirm}
        />
      </Modal>,
    );

    await user.click(screen.getByRole("button", { name: "Apri" }));
    expect(screen.getByText("Titolo di prova")).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: "Elimina" });
    await user.click(confirmButton);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("il bottone Annulla senza onClick custom chiude la modale", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal trigger={<button>Apri</button>} onClose={onClose}>
        <p>Contenuto modale</p>
      </Modal>,
    );

    await user.click(screen.getByRole("button", { name: "Apri" }));
    await user.click(screen.getByRole("button", { name: "Annulla" }));

    expect(screen.queryByText("Contenuto modale")).not.toBeInTheDocument();
    // Comportamento ATTUALE: tryClose() senza argomento produce result=true
    // anche per Annulla (vedi nota sui bug nel report del pezzo).
    expect(onClose).toHaveBeenCalledWith(true);
  });

  it("tryClose(result) propaga il ModalResult a onClose e chiude", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal trigger={<button>Apri</button>} onClose={onClose}>
        <ContextProbe closeResult={false} />
      </Modal>,
    );

    await user.click(screen.getByRole("button", { name: "Apri" }));
    await user.click(screen.getByRole("button", { name: "Chiudi con esito" }));

    expect(onClose).toHaveBeenCalledWith(false);
    expect(screen.queryByText("Contenuto modale")).not.toBeInTheDocument();
  });
});
