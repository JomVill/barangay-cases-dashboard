
import React, { useState } from "react";
import { Case, CaseStatus } from "@/lib/sample-data";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const statusColors: Record<CaseStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  ongoing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  resolved: "bg-green-100 text-green-800 hover:bg-green-100",
  dismissed: "bg-gray-100 text-gray-800 hover:bg-gray-100",
};

interface CaseTableProps {
  data: Case[];
  onDeleteCase: (id: string) => void;
  onUpdateStatus: (id: string, status: CaseStatus) => void;
}

const CaseTable = ({ data, onDeleteCase, onUpdateStatus }: CaseTableProps) => {
  const [caseToDelete, setCaseToDelete] = useState<string | null>(null);

  const handleStatusChange = (id: string, status: CaseStatus) => {
    onUpdateStatus(id, status);
    toast.success(`Case status updated to ${status}`);
  };

  const handleDelete = () => {
    if (caseToDelete) {
      onDeleteCase(caseToDelete);
      setCaseToDelete(null);
      toast.success("Case deleted successfully");
    }
  };

  const columns: ColumnDef<Case>[] = [
    {
      accessorKey: "id",
      header: "Case ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "complainant",
      header: "Complainant",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("type")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as CaseStatus;
        return (
          <Badge variant="secondary" className={statusColors[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "filedDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Filed Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return format(new Date(row.getValue("filedDate")), "MMM d, yyyy");
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const caseData = row.original;

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link to={`/cases/${caseData.id}`} className="w-full">
                    View details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Edit case</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Change status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => handleStatusChange(caseData.id, "pending")}>
                      <span className="flex items-center">
                        {caseData.status === "pending" && <Check className="mr-2 h-4 w-4" />}
                        <span className={caseData.status === "pending" ? "font-bold" : ""}>Pending</span>
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(caseData.id, "ongoing")}>
                      <span className="flex items-center">
                        {caseData.status === "ongoing" && <Check className="mr-2 h-4 w-4" />}
                        <span className={caseData.status === "ongoing" ? "font-bold" : ""}>Ongoing</span>
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(caseData.id, "resolved")}>
                      <span className="flex items-center">
                        {caseData.status === "resolved" && <Check className="mr-2 h-4 w-4" />}
                        <span className={caseData.status === "resolved" ? "font-bold" : ""}>Resolved</span>
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(caseData.id, "dismissed")}>
                      <span className="flex items-center">
                        {caseData.status === "dismissed" && <Check className="mr-2 h-4 w-4" />}
                        <span className={caseData.status === "dismissed" ? "font-bold" : ""}>Dismissed</span>
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600"
                  onClick={() => setCaseToDelete(caseData.id)}
                >
                  Delete case
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="animate-fade-in">
      <DataTable
        columns={columns}
        data={data}
        searchColumn="title"
        searchPlaceholder="Search cases..."
      />

      <AlertDialog open={!!caseToDelete} onOpenChange={(open) => !open && setCaseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this case?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the case record
              and remove the data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CaseTable;
