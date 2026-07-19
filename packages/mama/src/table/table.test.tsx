import { ColumnDef } from "@tanstack/react-table";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TableActionConfig } from "./table-action-config";
import { Table } from "./table";

type Product = { id: number; name: string; price: number };

const columns: ColumnDef<Product>[] = [
  { accessorKey: "name", header: "Nome" },
  { accessorKey: "price", header: "Prezzo" },
];

const products: Product[] = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Mouse", price: 25 },
];

describe("Table", () => {
  it("renderizza intestazioni e righe con dati tipizzati", () => {
    render(<Table<Product> data={products} columns={columns} />);

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Prezzo")).toBeInTheDocument();

    const rows = screen.getAllByRole("row");
    // 1 header + 2 righe dati
    expect(rows).toHaveLength(3);
    expect(within(rows[1]).getByText("Laptop")).toBeInTheDocument();
    expect(within(rows[1]).getByText("1200")).toBeInTheDocument();
    expect(within(rows[2]).getByText("Mouse")).toBeInTheDocument();
  });

  it("invoca l'azione di riga con i dati della riga al click", async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    const actions: TableActionConfig<Product>[] = [
      { key: "edit", type: "primary", action },
    ];

    render(
      <Table<Product> data={products} columns={columns} actions={actions} />,
    );

    const rows = screen.getAllByRole("row");
    const mouseRowButton = within(rows[2]).getByRole("button");
    await user.click(mouseRowButton);

    expect(action).toHaveBeenCalledTimes(1);
    expect(action).toHaveBeenCalledWith(products[1]);
  });

  it("chiama onStateChange al cambio pagina", async () => {
    const user = userEvent.setup();
    const onStateChange = vi.fn();

    render(
      <Table<Product>
        data={products}
        columns={columns}
        pagination={{ total: 30, page: 1, limit: 10 }}
        onStateChange={onStateChange}
      />,
    );

    await user.click(screen.getByText("2"));

    // Comportamento ATTUALE: pagination.page in input è 1-based, ma lo state
    // emesso è 0-based (react-paginate `selected`); l'app compensa con +1.
    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1 }),
    );
  });

  it("mostra il loader quando isLoading o quando data è undefined", () => {
    const { rerender } = render(
      <Table<Product> data={products} columns={columns} isLoading />,
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();

    rerender(<Table<Product> data={undefined} columns={columns} />);
    expect(screen.getByText("Loading")).toBeInTheDocument();

    rerender(<Table<Product> data={products} columns={columns} />);
    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
  });
});
