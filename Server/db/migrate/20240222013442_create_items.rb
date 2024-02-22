class CreateItems < ActiveRecord::Migration[7.1]
  def change
    create_table :items do |t|
      t.text :description
      t.text :notes

      t.timestamps
    end

    add_index :items, :description, name: 'ftDescription', type: :fulltext
  end
end
