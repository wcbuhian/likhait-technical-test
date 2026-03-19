
import React, { useState } from "react";
import { TextField, Button } from "../vibes";
import { defaultEmojis } from "../constants/defaultEmojis";
import { fetchCategories } from "../services/api";
import { CategoryFormData } from "../types";


export interface CategoryFormProps {
  initialData?: Partial<CategoryFormData>;
  onSubmit: (d: CategoryFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

// Modelled after Expense Form

export function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Commit Category'
}: CategoryFormProps) {

  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || '',
    emoji: initialData?.emoji || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<CategoryFormData>>({});

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const selectEmoji = (selectedEmoji: string) => {
    setFormData((prev) => ({ ...prev, emoji: selectedEmoji }));
  };
  const validateCategory = (): boolean => {
    const errors: Partial<CategoryFormData> = {};
    if (!formData.name.trim()) {
      errors.name = "Category name required"
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!validateCategory()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setFormData({
        name: "",
        emoji: "",
      });
      setErrors({});
      fetchCategories();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };


  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <TextField 
                label="Category Name"
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter new category name"
                onChange={handleChange}
                error={errors.name}
                required
            />
            <div style={{ marginBottom: '15px' }}>
              <p>Pick an Icon: {formData.emoji}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {defaultEmojis.map((emo) => (
                  <button
                    key={emo}
                    type="button" // Important: prevents form submission on click
                    onClick={() => {selectEmoji(emo)}}
                    style={{
                      fontSize: '1.5rem',
                      border: formData.emoji === emo ? '2px solid blue' : '1px solid #ccc',
                      cursor: 'pointer',
                      background: 'white',
                      borderRadius: '8px'
                    }}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>
            
            <div style = {buttonGroupStyle}>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : submitLabel}
              </Button>
                {onCancel && <Button
                  type="button"
                  variant="secondary"
                  onClick={onCancel}
                  fullWidth
                >
                  Cancel
                </Button>}
              
            </div>
        </form>
    )
}