
import { Shield } from 'lucide-react';

const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <Shield className="h-8 w-8 text-blue-600 mr-2" />
        <h2 className="text-3xl font-bold text-gray-900">Vendoor</h2>
      </div>
      <p className="mt-2 text-gray-600">Secure venue and service booking platform</p>
    </div>
  );
};

export default AuthHeader;
