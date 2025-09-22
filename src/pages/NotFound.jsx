import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Icon from "../components/AppIcon";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-background p-4"
      dir="rtl"
    >
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
          </div>
        </div>

        <h2 className="text-2xl font-medium text-onBackground mb-2">
          الصفحة غير موجودة
        </h2>
        <p className="text-onBackground/70 mb-8">
          الصفحة التي تبحث عنها غير موجودة. دعنا نعيدك إلى المسار الصحيح!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            icon={<Icon name="ArrowRight" />}
            iconPosition="left"
            onClick={() => window.history?.back()}
          >
            العودة للخلف
          </Button>

          <Button
            variant="outline"
            icon={<Icon name="Home" />}
            iconPosition="left"
            onClick={handleGoHome}
          >
            العودة للرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
