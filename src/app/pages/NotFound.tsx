/**
 * NOT FOUND PAGE
 * 404 error page for invalid routes
 */

import { Link } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { AlertCircle, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-16 w-16 mx-auto text-red-500" />
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-xl text-gray-600">Page Not Found</p>
          <p className="text-gray-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
