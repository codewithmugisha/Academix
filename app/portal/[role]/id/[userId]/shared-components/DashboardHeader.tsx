// Reusable header with dropdown, etc.
// ... your existing dropdown code

import { DropdownMenu } from "@/components/ui/dropdown-menu";

interface Props {
  user: object;
  signOut: () => void;
}

export const DashboardHeader = ({ user, signOut }: Props) => {
  // Your avatar dropdown JSX here
  return (
    <div className="flex justify-end mb-6">
      <DropdownMenu>
        {/* ... existing content */}
      </DropdownMenu>
    </div>
  );
};