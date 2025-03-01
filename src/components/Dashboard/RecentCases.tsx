
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Case, getRecentCases } from "@/lib/sample-data";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { ChevronRight, Clock } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  ongoing: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  resolved: "bg-green-100 text-green-800 hover:bg-green-200",
  dismissed: "bg-gray-100 text-gray-800 hover:bg-gray-200",
};

const RecentCases = () => {
  const recentCases = getRecentCases(5);

  return (
    <Card className="hover-card-effect">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Cases</CardTitle>
        <CardDescription>
          Latest case updates in your barangay
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-4">
          {recentCases.map((caseItem) => (
            <Link
              key={caseItem.id}
              to={`/cases/${caseItem.id}`}
              className="block transition-colors hover:bg-muted/50 rounded-md"
            >
              <div className="flex items-start justify-between p-3">
                <div className="space-y-1">
                  <div className="font-medium">{caseItem.title}</div>
                  <div className="line-clamp-1 text-sm text-muted-foreground">
                    {caseItem.description}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge
                      variant="secondary"
                      className={statusColors[caseItem.status]}
                    >
                      {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(new Date(caseItem.updatedAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentCases;
