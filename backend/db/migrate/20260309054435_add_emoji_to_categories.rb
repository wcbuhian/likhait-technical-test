class AddEmojiToCategories < ActiveRecord::Migration[7.2]
  def change
    add_column :categories, :emoji, :string
  end
end
