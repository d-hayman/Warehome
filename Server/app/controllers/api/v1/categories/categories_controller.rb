module Api
  module V1
    class Categories::CategoriesController < AuthenticatedController
      before_action -> {check_permissions( :Category, params[:action])}, only: [:index, :show, :create, :update, :destroy] 
      before_action :set_category, only: %i[show update destroy]

      def index
        @categories = Category.all.order(name: :asc)
        
        total_categories_count = Category.count
        
        render json: {
            categories: @categories,
            total_count: total_categories_count
        }
      end

      def show
        render json: include_subcategories(@category)
      end

      def create
        @category = Category.new(category_params)

        @category.creator = current_user
        
        if @category.save
            render json: @category
        else
            render json: @category.errors, status: :unprocessable_entity
        end
      end
        
      def update
        if @category.update(category_params)
          render json: @category
        else
          render json: @category.errors, status: :unprocessable_entity
        end
      end
        
      def destroy
        @category.destroy
      end

      private

      def set_category
        @category = Category.find(params[:id])
      end

      def include_subcategories(category)
        category.as_json.merge(subcategories: category.subcategories)
      end

      def category_params
        params.require(:category).permit(:name, :description)
      end
    end
  end
end