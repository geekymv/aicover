"use client";

import { BsShare } from "react-icons/bs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "sonner";

export default function ({ shareUrl }: { shareUrl: string }) {
  return (
    <CopyToClipboard
      text={`I made a beautiful AI Coloring Pages, share it with you
      
${shareUrl}`}
      onCopy={() => toast.success("Content copied! Share it with your friends!")}
    >
      <a className="ml-4 bg-black cursor-pointer text-white hover:bg-black hover:text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 mt-4 mx-auto">
        <BsShare className="mr-2" />
        Share
      </a>
    </CopyToClipboard>
  );
}
