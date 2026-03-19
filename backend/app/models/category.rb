class Category < ApplicationRecord
  has_many :expenses, dependent: :destroy
# validation logic for Category
  validates :name, presence: true

  validate :emoji_is_single_char, if: -> { emoji.present? }

  private

  def emoji_is_single_char
    if emoji.grapheme_clusters.length != 1
      errors.add(:emoji, "must be a single character")
    end
  end
end
