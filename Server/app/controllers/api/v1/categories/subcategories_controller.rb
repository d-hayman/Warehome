module Api
    module V1
      class Categories::SubcategoriesController < AuthenticatedController
        before_action -> {check_permissions( :Subcategory, params[:action])}
        before_action :set_category
        before_action :set_subcategory, only: %i[show update destroy]
  
        def index
          @subcategories = @category.subcategories.order(name: :asc)
          
          total_subcategories_count = @category.subcategories.count
          
          render json: {
              subcategories: @subcategories,
              total_count: total_subcategories_count
          }
        end
  
        def show
          render json: @subcategory
        end
  
        def create
          @subcategory = @category.subcategories.new(subcategory_params)
  
          @subcategory.creator = current_user
          
          if @subcategory.save
              render json: @subcategory
          else
              render json: @subcategory.errors, status: :unprocessable_entity
          end
        end
          
        def update
          if @subcategory.update(subcategory_params)
            render json: @subcategory
          else
            render json: @subcategory.errors, status: :unprocessable_entity
          end
        end
          
        def destroy
          @subcategory.destroy
        end
  
        private
  
        def set_category
          @category = Category.find(params[:category_id])
        end
  
        def set_subcategory
          @subcategory = @category.subcategories.find(params[:id])
        end
  
        def subcategory_params
          params.require(:subcategory).permit(:name, :description)
        end
      end
    end
  end