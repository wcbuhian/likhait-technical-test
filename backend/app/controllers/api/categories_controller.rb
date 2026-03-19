class Api::CategoriesController < ApplicationController
  def index
    categories = Category.order(:name)
    render json: categories
  end

  def create
    category = Category.new(category_params)
    if category.save
      render json: format_category(category), status: :created
    else
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    category = Category.find(params[:id])
    category.destroy
    head :no_content
  end

  private
  def category_params
    params.require(:category).permit(:name, :emoji)
  end

  def format_category(category)
    {
      name: category.name,
      created_at: category.created_at,
      updated_at: category.updated_at,
      emoji: category.emoji
    }
  end
end
