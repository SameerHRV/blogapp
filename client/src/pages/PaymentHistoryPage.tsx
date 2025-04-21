import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import { useAuth } from "@/contexts/AuthContext";
import { usePayment } from "@/contexts/PaymentContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

const PaymentHistoryPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { getPaymentHistory, paymentHistory, isLoading } = usePayment();
  const navigate = useNavigate();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/payment-history" } });
      return;
    }

    const fetchPaymentHistory = async () => {
      await getPaymentHistory();
      setIsInitialLoading(false);
    };

    fetchPaymentHistory();
  }, [isAuthenticated, navigate, getPaymentHistory]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "created":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isInitialLoading || isLoading) {
    return (
      <BlogLayout>
        <div className="blog-container py-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <div className="blog-container py-12">
        <h1 className="text-3xl font-bold mb-8">Payment History</h1>

        <Card>
          <CardHeader>
            <CardTitle>Your Transactions</CardTitle>
            <CardDescription>A record of all your payments and subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentHistory.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No payment history found.</p>
                <p className="text-sm mt-2">
                  Your payment records will appear here once you make a purchase.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valid Until</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell>
                        {payment.paymentDate
                          ? format(new Date(payment.paymentDate), "MMM d, yyyy")
                          : format(new Date(), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="font-medium">{payment.planName}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        {payment.validUntil
                          ? format(new Date(payment.validUntil), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </BlogLayout>
  );
};

export default PaymentHistoryPage;
