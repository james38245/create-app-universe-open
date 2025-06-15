
import { CheckCircle } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      requirements: {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
      }
    };
  };

  const validation = validatePassword(password);

  return (
    <div className="mt-2 text-xs space-y-1">
      <p className="text-gray-600">Password must contain:</p>
      <div className="grid grid-cols-2 gap-1">
        <div className={`flex items-center gap-1 ${validation.requirements.minLength ? 'text-green-600' : 'text-gray-400'}`}>
          {validation.requirements.minLength ? <CheckCircle className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-300" />}
          <span>8+ characters</span>
        </div>
        <div className={`flex items-center gap-1 ${validation.requirements.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
          {validation.requirements.hasUpperCase ? <CheckCircle className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-300" />}
          <span>Uppercase</span>
        </div>
        <div className={`flex items-center gap-1 ${validation.requirements.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`}>
          {validation.requirements.hasLowerCase ? <CheckCircle className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-300" />}
          <span>Lowercase</span>
        </div>
        <div className={`flex items-center gap-1 ${validation.requirements.hasNumbers ? 'text-green-600' : 'text-gray-400'}`}>
          {validation.requirements.hasNumbers ? <CheckCircle className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-300" />}
          <span>Number</span>
        </div>
        <div className={`flex items-center gap-1 ${validation.requirements.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}>
          {validation.requirements.hasSpecialChar ? <CheckCircle className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-300" />}
          <span>Special char</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordRequirements;
