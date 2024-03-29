module Api
    module V1
      class Items::ItemsController < AuthenticatedController
        before_action -> {check_permissions( :Item, params[:action])}
        before_action :set_item, only: %i[show update destroy fetch_containers add_subcategory remove_subcategory]
        before_action :set_containment, only: %i[fetch_container]
        before_action :set_subcategory, only: %i[add_subcategory remove_subcategory]
  
        def index
          items_per_page = 24
          # filter first by search term
          @items = params.has_key?(:q) ? Item.search_term(params[:q]) : Item.all

          # if subcategories or categories are selected filter by those as well
          if params.has_key?(:category_ids) || params.has_key?(:subcategory_ids)
            @items = @items&.in_categories(
              params.has_key?(:category_ids) ? params[:category_ids] : [],
              params.has_key?(:subcategory_ids) ? params[:subcategory_ids] : []
            )
          end

          @items = @items.distinct

          if params.has_key?(:order_by)
            @items = params[:order_by] == "Description" ? @items.order(description: :asc) : @items.order(id: :desc)
          end

          total_items_count = @items.count

          # finally, paginate the results
          @items = @items.page(params[:page]).per(items_per_page)
          
          
          render json: {
              items: @items.map{ |item| augment_with_image(item)},
              total_count: total_items_count,
              per_page: items_per_page
          }
        end
  
        def show
          render json: augment_with_image(@item)
                          .as_json.merge(subcategories: @item.subcategories
                          .map{|sub| sub.as_json.merge(category: sub.category)})
        end
  
        def create
          @item = Item.new(item_params)
  
          @item.creator = current_user
          
          if @item.save
              render json: @item
          else
              render json: @item.errors, status: :unprocessable_entity
          end
        end
          
        def update
          if @item.update(item_params)
            render json: @item
          else
            render json: @item.errors, status: :unprocessable_entity
          end
        end
          
        def destroy
          @item.destroy
        end

        def fetch_containers
          render json: {
            containers: @item.containments.map{|containment| containment.as_json.merge(container: augment_with_image(containment.container))}
          }
        end

        def fetch_container
          render json: @containment.as_json.merge(container: augment_with_image(@containment.container))
        end

        def add_subcategory
          @item.subcategories << @subcategory

          render json: @item.subcategories
        end

        def remove_subcategory
          @item.subcategories.destroy @subcategory

          render json: @item.subcategories
        end
  
        private
  
        def set_item
          if ["add_subcategory","remove_subcategory","fetch_containers"].include? params[:action]
            @item = Item.find(params[:item_id])
          else
            @item = Item.find(params[:id])
          end
        end

        #only applicable to add_subcategory and remove_subcategory, otherwise :id is a item ID
        def set_subcategory
         @subcategory = Subcategory.find(params[:id])
        end
  
        def set_containment
          @containment =  Containment.find_by(container_id:params[:container_id], item_id:params[:item_id])
        end
  
        def item_params
          params.require(:item).permit(:description, :notes, :image)
        end
      end
    end
  end