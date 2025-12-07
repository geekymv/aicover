"use client";

import { KeyboardEvent, useContext, useEffect, useRef, useState } from "react";

import { AppContext } from "@/contexts/AppContext";
import { Cover } from "@/types/cover";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function () {
  const router = useRouter();
  const { setCovers, user, fetchUserInfo } = useContext(AppContext);
  const [description, setDiscription] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [taskType, setTaskType] = useState<"Line Art" | "Simple Sketch">("Line Art");
  const [aspectRatio, setAspectRatio] = useState<
    "1:1" | "2:3" | "3:2"
  >("2:3");
  const [outputs, setOutputs] = useState<number>(1);

  const handleInputKeydown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === "Enter" && !e.shiftKey) {
      if (e.keyCode !== 229) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    console.log("description", description);
    if (!description) {
      toast.error("Please enter a prompt");
      inputRef.current?.focus();
      return;
    }

    if (!user) {
      toast.error("Please login");
      router.push("/sign-in");
      return;
    }
    
    if (user.credits && user.credits.left_credits < 1) {
      toast.error("余额不足，请先充值");
      router.push("/pricing");
      return;
    }

    try {
      const params = {
        description: description,
        taskType: taskType,
        aspectRatio: aspectRatio,
        outputs: outputs,
      };

      setLoading(true);
      setProgress(5);
      // 启动前端估算进度（最多到 95%，完成时置为 100%）
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev < 85) return Math.min(prev + 2, 85);
          if (prev < 95) return Math.min(prev + 1, 95);
          return prev;
        });
      }, 2000);
      const resp = await fetch("/api/gen-cover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const { code, message, data } = await resp.json();
      

      if (resp.status === 401) {
        toast.error("Please login");
        router.push("/sign-in");
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setLoading(false);
        return;
      }
      console.log("gen image resp", resp);

      if (code !== 0) {
        toast.error(message);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setLoading(false);
        return;
      }

      fetchUserInfo();
      setDiscription("");
      
      if (data) {
        console.log("new cover", data);
        var taskId = data.taskId;
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = setInterval(async () => {
          const resp = await fetch(`/api/task/${taskId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const { code, message, data } = await resp.json();
          if (code!== 0) {
            toast.error(message);
            return;
          }
          if (data.status === 2) {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            setProgress(100);
            setLoading(false);
            toast.success("Success!");
            router.push(`/covers/latest`);
          } else if (data.status === 3) {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            setLoading(false);
            toast.error("Image Generator Failed!");
          } 
        }, 20_000)
        
      }
    } catch (e) {
      console.log("gen cover failed", e);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (description) {
      if (!user) {
        toast.error("Please login");
        router.push("/sign-in");
        return;
      }
    }
  }, [description]);

  useEffect(() => {
    // 卸载时清理定时器
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-4 md:mt-16">
      <div className="relative">
        <textarea
          className="mb-4 h-32 w-full rounded-md border border-solid border-primary px-3 py-4 pr-16 text-sm text-[#333333] focus:border-primary resize-none"
          placeholder="Enter your prompt"
          ref={inputRef}
          value={description}
          onChange={(e) => setDiscription(e.target.value)}
          onKeyDown={handleInputKeydown}
          maxLength={500}
        />
        <div className="absolute bottom-6 right-3 text-xs text-gray-500">
          {description.length}/500
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <div>
          <div className="mb-2 text-sm font-medium text-[#333333]">Select Styles</div>
          <div className="flex flex-wrap gap-2">
            {["Line Art", "Simple Sketch"].map((style) => (
              <button
                key={style}
                type="button"
                className={`px-3 py-2 rounded-md text-sm border ${
                  taskType === style
                    ? "bg-primary text-white border-primary"
                    : "border-gray-200 text-[#333333] hover:border-primary"
                }`}
                onClick={() => setTaskType(style as "Line Art" | "Simple Sketch")}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm font-medium text-[#333333]">Image Dimensions</div>
          <div className="flex flex-wrap gap-2">
            {["1:1", "2:3", "3:2"].map((ratio) => (
              <button
                key={ratio}
                type="button"
                className={`px-3 py-2 rounded-md text-sm border ${
                  aspectRatio === ratio
                    ? "bg-primary text-white border-primary"
                    : "border-gray-200 text-[#333333] hover:border-primary"
                }`}
                onClick={() => setAspectRatio(ratio as any)}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-[#333333]">Number of Outputs</div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 4].map((n) => (
              <button
                key={n}
                type="button"
                className={`w-10 py-2 rounded-md text-sm border text-center ${
                  outputs === n
                    ? "bg-primary text-white border-primary"
                    : "border-gray-200 text-[#333333] hover:border-primary"
                }`}
                onClick={() => setOutputs(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        {loading ? (
          <button
            className="cursor-pointer rounded-md bg-primary px-6 py-2 text-center font-semibold text-white"
            disabled
          >
            Generating...
          </button>
        ) : (
          <button
            className="cursor-pointer rounded-md bg-primary border-primary px-6 py-2 text-center font-semibold text-white"
            onClick={handleSubmit}
          >
            Generate
          </button>
        )}
      </div>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[320px] rounded-lg bg-white p-6 text-center shadow-lg">
            <div className="mx-auto mb-4 relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-[#333333]">{progress}%</div>
            </div>
            <div className="mb-1 text-base font-medium text-[#333333]">正在生成中，请勿刷新页面</div>
            <div className="text-sm text-gray-500">生成需要一定时间，请耐心等待…</div>
          </div>
        </div>
      )}
    </div>
  );
}
