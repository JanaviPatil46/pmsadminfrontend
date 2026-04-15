import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical, LinkIcon, KeyRound } from 'lucide-react'

const MenuDropdown = ({ contact, onUnlink, onResetPassword }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleUnlinkClick = () => {
    onUnlink(contact);
    setOpen(false);
  };

  const handleResetPasswordClick = () => {
    onResetPassword(contact);
    setOpen(false);
  };

  return (
    <div className="relative inline-block ml-1" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-1 w-44 bg-card rounded-lg border border-border shadow-lg py-1">
            <button
              onClick={handleUnlinkClick}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LinkIcon size={14} />
              Unlink
            </button>
            <button
              onClick={handleResetPasswordClick}
              disabled={!contact.canLogin}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <KeyRound size={14} />
              Reset Password
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default MenuDropdown


