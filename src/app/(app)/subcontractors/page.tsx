import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Phone, Mail } from "lucide-react";

export default async function SubcontractorsPage() {
  const supabase = await createClient();

  const { data: subs } = await supabase
    .from("subcontractors")
    .select("*")
    .order("name");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Subcontractors</h1>
        <p className="text-gray-500">Manage your renovation subcontractors</p>
      </div>

      {/* Desktop table */}
      <Card className="hidden sm:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Trade</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subs?.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.name}</TableCell>
                  <TableCell>{sub.company || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{sub.trade}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm text-gray-500">
                      {sub.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {sub.phone}
                        </span>
                      )}
                      {sub.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {sub.email}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        sub.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }
                    >
                      {sub.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {(!subs || subs.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No subcontractors found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile cards */}
      <div className="space-y-3 sm:hidden">
        {subs?.map((sub) => (
          <Card key={sub.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{sub.name}</p>
                  {sub.company && (
                    <p className="text-sm text-gray-500">{sub.company}</p>
                  )}
                </div>
                <Badge
                  className={
                    sub.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }
                >
                  {sub.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="mt-2">
                <Badge variant="secondary">{sub.trade}</Badge>
              </div>
              <div className="mt-3 space-y-1 text-sm text-gray-500">
                {sub.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    <a href={`tel:${sub.phone}`} className="hover:underline">
                      {sub.phone}
                    </a>
                  </div>
                )}
                {sub.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    <a href={`mailto:${sub.email}`} className="hover:underline">
                      {sub.email}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {(!subs || subs.length === 0) && (
          <p className="text-sm text-gray-500">No subcontractors found.</p>
        )}
      </div>
    </div>
  );
}
