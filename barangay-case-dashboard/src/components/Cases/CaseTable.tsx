import React, { useState, useEffect } from "react";
import { Case, CaseStatus } from "@/lib/sample-data";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef, SortingState, useReactTable } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal, Check, Edit, Eye, AlertTriangle, Download, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CaseEditForm } from "@/components/Cases/CaseEditForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  onExportCases: (selectedIds: string[]) => void;
}

const CaseTable = ({ data, onDeleteCase, onUpdateStatus, onExportCases }: CaseTableProps) => {
  const [caseToDelete, setCaseToDelete] = useState<string | null>(null);
  const [caseToView, setCaseToView] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'updatedAt', desc: true }
  ]);
  
  // Add state for bulk deletion
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);
  const [bulkDeleteConfirmation, setBulkDeleteConfirmation] = useState<string>("");
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState<boolean>(false);

  const handleStatusChange = (id: string, status: CaseStatus) => {
    onUpdateStatus(id, status);
    toast.success(`Case status updated to ${status}`);
  };

  const handleBulkStatusChange = (ids: string[], status: CaseStatus) => {
    if (!ids.length) return;
    
    // Create a copy of the selected IDs to ensure we're working with a stable array
    const selectedIds = [...ids];
    
    // Call the onUpdateStatus function for each selected case
    selectedIds.forEach(id => {
      if (id) {
        onUpdateStatus(id, status);
      }
    });
    
    // Show success message
    toast.success(`Updated ${selectedIds.length} cases to ${status}`);
  };

  const handleDelete = () => {
    if (caseToDelete) {
      onDeleteCase(caseToDelete);
      setCaseToDelete(null);
      toast.success("Case deleted successfully");
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    if (!ids.length) return;
    
    // Create a copy of the selected IDs to ensure we're working with a stable array
    setBulkDeleteIds([...ids]);
    setShowBulkDeleteDialog(true);
    setBulkDeleteConfirmation("");
  };

  const confirmBulkDelete = () => {
    if (bulkDeleteConfirmation === bulkDeleteIds.length.toString()) {
      // Create a copy of the IDs to ensure we're working with a stable array
      const idsToDelete = [...bulkDeleteIds];
      
      // Delete each case one by one
      idsToDelete.forEach(id => onDeleteCase(id));
      
      // Reset state
      setShowBulkDeleteDialog(false);
      setBulkDeleteIds([]);
      setBulkDeleteConfirmation("");
      
      // Show success message
      toast.success(`Deleted ${idsToDelete.length} cases`);
    } else {
      toast.error("Confirmation number doesn't match the number of selected cases");
    }
  };

  const handleViewCase = (id: string) => {
    setCaseToView(id);
    setActiveTab("details");
  };

  const handleEditCase = (id: string) => {
    setCaseToView(id);
    setActiveTab("edit");
  };

  const columns: ColumnDef<Case>[] = [
    {
      accessorKey: "id",
      header: "Case ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
      sortingFn: (rowA, rowB) => {
        // Custom sorting for case IDs (e.g., DS-2024-001)
        const a = rowA.getValue("id") as string;
        const b = rowB.getValue("id") as string;
        return a.localeCompare(b);
      }
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const caseData = row.original;
        return (
          <Button 
            variant="link" 
            className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:underline text-left justify-start"
            onClick={() => handleViewCase(caseData.id)}
          >
            {caseData.title}
          </Button>
        );
      },
    },
    {
      accessorKey: "complainant",
      header: "Complainant",
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("type")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
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
        >
          Filed Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => format(new Date(row.getValue("filedDate")), "MMM d, yyyy"),
      sortingFn: "datetime"
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => format(new Date(row.getValue("updatedAt")), "MMM d, yyyy"),
      sortingFn: "datetime"
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const caseData = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewCase(caseData.id)}>
                <Eye className="h-4 w-4 mr-2" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditCase(caseData.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit case
              </DropdownMenuItem>
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
                onClick={() => setCaseToDelete(caseData.id)}
                className="text-red-600"
              >
                Delete case
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Find the case data for the currently viewed case
  const viewedCase = data.find(c => c.id === caseToView);

  // Add a check to ensure we can handle all case formats
  useEffect(() => {
    // Log any cases that might have issues
    const problematicCases = data.filter(c => !c.id || typeof c.id !== 'string');
    if (problematicCases.length > 0) {
      console.warn('Found cases with missing or invalid IDs:', problematicCases);
    }
  }, [data]);

  const table = useReactTable({
    columns,
    data,
    searchColumn: "title",
    searchPlaceholder: "Search cases...",
    sorting,
    onSortingChange: setSorting,
    onBulkStatusChange: handleBulkStatusChange,
    onBulkDelete: handleBulkDelete,
    renderTopToolbar: ({ table }) => {
      const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;
      
      return selectedRowsCount > 0 ? (
        <div className="flex items-center gap-2 p-2">
          <span className="text-sm font-medium">
            {selectedRowsCount} {selectedRowsCount === 1 ? 'row' : 'rows'} selected
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onExportCases(table.getFilteredSelectedRowModel().rows.map(row => row.getValue("id")))}>
                <Download className="h-4 w-4 mr-2" />
                Export Selected Cases
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleBulkDelete(table.getFilteredSelectedRowModel().rows.map(row => row.getValue("id")))}>
                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                Delete Selected Cases
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Update Status
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => handleBulkStatusChange(table.getFilteredSelectedRowModel().rows.map(row => row.getValue("id")), "pending")}>
                    <Badge className={statusColors.pending}>Pending</Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkStatusChange(table.getFilteredSelectedRowModel().rows.map(row => row.getValue("id")), "ongoing")}>
                    <Badge className={statusColors.ongoing}>Ongoing</Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkStatusChange(table.getFilteredSelectedRowModel().rows.map(row => row.getValue("id")), "resolved")}>
                    <Badge className={statusColors.resolved}>Resolved</Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkStatusChange(table.getFilteredSelectedRowModel().rows.map(row => row.getValue("id")), "dismissed")}>
                    <Badge className={statusColors.dismissed}>Dismissed</Badge>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null;
    }
  });

  return (
    <div className="animate-fade-in">
      <DataTable
        columns={columns}
        data={data}
        searchColumn="title"
        searchPlaceholder="Search cases..."
        sorting={sorting}
        onSortingChange={setSorting}
        onBulkStatusChange={handleBulkStatusChange}
        onBulkDelete={handleBulkDelete}
      />

      {/* Single case delete confirmation */}
      <AlertDialog open={!!caseToDelete} onOpenChange={(open) => !open && setCaseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this case?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the case
              and remove the data from our servers.
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

      {/* Bulk delete confirmation dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Bulk Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete <strong>{bulkDeleteIds.length}</strong> cases. This action cannot be undone.
              <div className="mt-4">
                <p className="mb-2">To confirm, please type <strong>{bulkDeleteIds.length}</strong> below:</p>
                <Input 
                  value={bulkDeleteConfirmation}
                  onChange={(e) => setBulkDeleteConfirmation(e.target.value)}
                  placeholder="Type the number of cases"
                  className="mt-1"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setBulkDeleteIds([]);
              setBulkDeleteConfirmation("");
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmBulkDelete} 
              className="bg-red-600 hover:bg-red-700"
              disabled={bulkDeleteConfirmation !== bulkDeleteIds.length.toString()}
            >
              Delete {bulkDeleteIds.length} Cases
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Case view/edit dialog */}
      <Dialog open={!!caseToView} onOpenChange={(open) => !open && setCaseToView(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewedCase?.title || "Case Details"}</DialogTitle>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              {viewedCase && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Case Type</h3>
                      <p className="capitalize">{viewedCase.type}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <Badge className={statusColors[viewedCase.status]}>
                        {viewedCase.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p>{viewedCase.description || "No description provided."}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Complainant</h3>
                      <p>{viewedCase.complainant}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Respondent</h3>
                      <p>{viewedCase.respondent}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Filed Date</h3>
                      <p>{format(new Date(viewedCase.filedDate), "MMM d, yyyy")}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                      <p>{format(new Date(viewedCase.updatedAt), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  
                  {viewedCase.resolvedDate && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Resolved Date</h3>
                      <p>{format(new Date(viewedCase.resolvedDate), "MMM d, yyyy")}</p>
                    </div>
                  )}
                  
                  {/* Add tags section */}
                  {viewedCase.tags && viewedCase.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {viewedCase.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button onClick={() => setActiveTab("edit")}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Case
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="edit">
              {caseToView && (
                <CaseEditForm
                  caseId={caseToView}
                  onSave={() => setCaseToView(null)}
                  onCancel={() => setActiveTab("details")}
                />
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaseTable;
