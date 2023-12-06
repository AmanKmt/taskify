'use client'

import { toast } from "sonner";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useRef, ElementRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { CardWithList } from "@/types";

import { useAction } from "@/hooks/use-action";
import { Button } from "@/components/ui/button";
import { updateCard } from "@/actions/update-card";
import { Skeleton } from "@/components/ui/skeleton";
import { FormSubmit } from "@/components/form/form-button";
import { FormTextarea } from "@/components/form/form-textarea";

interface DescriptionProps {
    data: CardWithList;
};

export const Description = ({ data }: DescriptionProps) => {
    const params = useParams();
    const queryClient = useQueryClient();

    const formRef = useRef<ElementRef<"form">>(null);
    const textareaRef = useRef<ElementRef<"textarea">>(null);

    const [isEditing, setIsEditing] = useState(false);

    const { execute, fieldErrors } = useAction(updateCard, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["card", data.id],
            });
            
            queryClient.invalidateQueries({
                queryKey: ["card-logs", data.id],
            });
            
            toast.success(`Card "${data.title}" updated`);
            disableEditing();   
        },

        onError: (error) => {
            toast.error(error);
        },
    });

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textareaRef.current?.focus();
        });
    };

    const disableEditing = () => {
        setIsEditing(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing();
        }
    };

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disableEditing);

    const onSubmit = (formData: FormData) => {
        const description = formData.get("description") as string;
        const boardId = params.boardId as string;

        execute({ id: data.id, description, boardId });
    };

    return (
        <div className="flex items-start gap-x-3 w-full">
            <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />

            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">Description</p>

                {isEditing ? (
                    <form ref={formRef} action={onSubmit} className="space-y-2">
                        <FormTextarea ref={textareaRef} id="description" className="w-full mt-2" placeholder="Add a more detailed description..." defaultValue={data.description || undefined} errors={fieldErrors} />

                        <div className="flex items-center gap-x-2">
                            <FormSubmit>
                                Save
                            </FormSubmit>

                            <Button type="button" onClick={disableEditing} size="sm" variant="ghost">
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div onClick={enableEditing} role="button" className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md text-neutral-800">
                        {data.description || "Add a more detailed description..."}
                    </div>
                )}

            </div>
        </div>
    );
};

Description.Skeleton = function DescriptionSkeleton() {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className="h-6 w-6 bg-neutral-200" />

            <div className="w-full">
                <Skeleton className="bg-neutral-200 w-24 h-6 mb-2" />
                <Skeleton className="bg-neutral-200 w-full h-[78px]" />
            </div>
        </div>
    );
};