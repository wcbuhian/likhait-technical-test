class Expense < ApplicationRecord
  belongs_to :category
  validates :description, :amount, :date, presence: true
  validates :date, comparison: { less_than_or_equal_to: -> {Date.current} }
end
