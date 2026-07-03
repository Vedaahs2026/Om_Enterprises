"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit2, Trash2, Image as ImageIcon } from "lucide-react";

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  isActive: boolean;
  displayOrder: number;
}

interface Props {
  item: CategoryItem;
  onEdit: (item: CategoryItem) => void;
  onDelete: (id: number) => void;
}

export function SortableCategoryItem({ item, onEdit, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: 'relative' as const,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className={`bg-white hover:bg-brand/5 transition-all ${isDragging ? 'shadow-lg border-2 border-brand-accent/20' : ''}`}>
      <td className="px-8 py-6 w-16">
        <button 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-2 text-brand/20 hover:text-[#FF9800] transition-colors outline-none"
          type="button"
        >
          <GripVertical size={16} />
        </button>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand/5 border border-brand/5 flex items-center justify-center flex-shrink-0 relative group">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "";
                  e.currentTarget.parentElement?.classList.add("bg-brand/10");
                }}
              />
            ) : (
              <ImageIcon className="text-brand/20" size={18} />
            )}
          </div>
          <div>
            <span className="text-sm font-bold text-brand uppercase tracking-wider block">{item.name}</span>
            <span className="text-[10px] font-semibold text-brand/40 block mt-1">Slug: {item.slug}</span>
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
          item.isActive 
            ? "bg-green-50 border-green-100 text-green-600" 
            : "bg-gray-50 border-gray-100 text-gray-400"
        }`}>
          {item.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-8 py-6 text-right">
        <div className="flex items-center justify-end space-x-3">
          <button 
            onClick={() => onEdit(item)}
            className="p-2 hover:bg-brand/5 text-brand/40 hover:text-brand rounded-lg transition-all"
            title="Edit Category"
            type="button"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={() => onDelete(item.id)}
            className="p-2 hover:bg-red-50 text-brand/20 hover:text-red-600 rounded-lg transition-all"
            title="Delete Category"
            type="button"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
