class Item < ApplicationRecord
    has_one_attached :image

    has_many :containments
    has_many :containers, through: :containments
    has_many :checkouts, through: :containments

    has_and_belongs_to_many :subcategories

    belongs_to :creator, class_name: "User", optional: true

    validates :description, presence: true

    scope :search_term, ->(query) do
		where('description LIKE ?', 
			"%#{sanitize_sql_like(query)}%")
	end
end
