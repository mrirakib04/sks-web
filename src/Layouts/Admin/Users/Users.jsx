import { useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { IoMdAddCircle } from "react-icons/io";
import { HeadProvider, Title } from "react-head";

const Users = () => {
  const AxiosSecure = useAxiosSecure();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data: users = [], refetch: refetchUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await AxiosSecure.get(`/users/none`);
      return res.data;
    },
    retry: 3,
    retryDelay: 2000,
  });

  console.log(users);

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => {
        const name = info.getValue();
        return (
          <span
            data-tooltip-id="my-tooltip"
            data-tooltip-content={name}
            className="block truncate sm:truncate sm:max-w-none max-w-[5rem] font-medium"
          >
            {name}
          </span>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => {
        const email = info.getValue();
        return (
          <span
            data-tooltip-id="my-tooltip"
            data-tooltip-content={email}
            className="block truncate sm:max-w-none max-w-[4rem]"
          >
            {email}
          </span>
        );
      },
    },
    {
      accessorKey: "image",
      header: "Photo",
      cell: (info) => (
        <img
          src={info.getValue()}
          alt={info.row.original.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <button
          data-tooltip-id="my-tooltip"
          data-tooltip-content={"Add as moderator"}
          onClick={() => assignUser(info.row.original)}
          className={"text-3xl text-green-400 transition hover:text-green-700"}
        >
          <IoMdAddCircle></IoMdAddCircle>
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });
  return (
    <div className="w-full">
      <HeadProvider>
        <Title>Users || Admin || SKS</Title>
      </HeadProvider>
      <div className="lg:w-4/5 md:w-8/12 sm:w-10/12 mx-auto">
        {/* Table */}
        <h2 className="text-center lg:text-4xl md:text-3xl text-2xl font-semibold py-5">
          Users List
        </h2>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100 font-bold">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border border-gray-300 px-2 py-2 text-left"
                  >
                    {header.isPlaceholder
                      ? null
                      : header.column.columnDef.header}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border border-gray-300 px-2 py-1"
                  >
                    {cell.column.columnDef.cell
                      ? cell.column.columnDef.cell(cell)
                      : cell.getValue()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span>
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
          <select
            value={pagination.pageSize}
            onChange={(e) =>
              setPagination(() => ({
                pageIndex: 0,
                pageSize: Number(e.target.value),
              }))
            }
            className="ml-4 p-2 border border-gray-300 rounded"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Users;
