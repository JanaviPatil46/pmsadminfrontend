import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const FileRequest = () => {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">File Requests</h2>
          <p className="text-sm text-gray-400 mt-0.5">Files requested from this account</p>
        </div>
        <Badge variant="secondary" className="text-xs font-medium px-2.5 py-1 rounded-full">0 requests</Badge>
      </div>

      {/* Empty State Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-inner">
          <FolderOpen size={28} className="text-gray-300" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-gray-500">No file requests yet</p>
          <p className="text-xs text-gray-300 max-w-xs">
            File requests will appear here once they are created for this account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileRequest;