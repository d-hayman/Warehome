class Item < ApplicationRecord
    has_one_attached :image

    has_many :containments
    has_many :containers, through: :containments
    has_many :checkouts, through: :containments

    has_and_belongs_to_many :subcategories
    has_many :categories, -> { distinct }, through: :subcategories

    belongs_to :creator, class_name: "User", optional: true

    validates :description, presence: true

    scope :search_term, ->(query) do
		where('items.description LIKE ?', 
			"%#{sanitize_sql_like(query)}%")
	end
    
    scope :in_categories, ->(category_ids, subcategory_ids) do
        #joins(:subcategories). this is done implicitly as part of the categories join due to the nature of this particular schema layout
        joins(:categories).where(subcategories: {id: subcategory_ids}).or(where(categories: {id: category_ids}))
    end
end
