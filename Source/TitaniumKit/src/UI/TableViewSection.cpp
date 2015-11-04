/**
 * Titanium.UI.TableViewSection
 *
 * Copyright (c) 2015 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License.
 * Please see the LICENSE included with this distribution for details.
 */

#include "Titanium/UI/TableViewSection.hpp"
#include "Titanium/UI/View.hpp"
#include "Titanium/UI/TableView.hpp"
#include "Titanium/UI/TableViewRow.hpp"
#include "Titanium/detail/TiImpl.hpp"

namespace Titanium
{
	namespace UI
	{
		TableViewSection::TableViewSection(const JSContext& js_context) TITANIUM_NOEXCEPT
			: Module(js_context, "Titanium.UI.TableViewSection"),
			footerTitle__(""),
			headerTitle__("")
		{
			TITANIUM_LOG_INFO("Titanium::UI::TableViewSection ctor");
		}

		TITANIUM_PROPERTY_READWRITE(TableViewSection, std::string, footerTitle)
		TITANIUM_PROPERTY_READWRITE(TableViewSection, std::shared_ptr<View>, footerView)
		TITANIUM_PROPERTY_READWRITE(TableViewSection, std::string, headerTitle)
		TITANIUM_PROPERTY_READWRITE(TableViewSection, std::shared_ptr<View>, headerView)
		TITANIUM_PROPERTY_READ(TableViewSection, std::vector<std::shared_ptr<TableViewRow>>, rows)

		std::uint32_t TableViewSection::get_rowCount() const TITANIUM_NOEXCEPT
		{
			return static_cast<std::uint32_t>(rows__.size());
		}

		void TableViewSection::add(const std::shared_ptr<TableViewRow>& row) TITANIUM_NOEXCEPT
		{
			rows__.push_back(row);
			fireTableViewSectionEvent("append", static_cast<std::uint32_t>(rows__.size() - 1));
		}

		void TableViewSection::remove(const std::shared_ptr<TableViewRow>& row) TITANIUM_NOEXCEPT
		{
			const auto it = find(rows__.begin(), rows__.end(), row);
			const auto index= std::distance(rows__.begin(), it);
			rows__.erase(it);
			fireTableViewSectionEvent("remove", static_cast<std::uint32_t>(index));
		}

		std::shared_ptr<TableViewRow> TableViewSection::rowAtIndex(const uint32_t& index) TITANIUM_NOEXCEPT
		{
			return rows__.at(index);
		}

		void TableViewSection::fireTableViewSectionEvent(const std::string& event_name, const std::uint32_t& rowIndex)
		{
			// return if no table view attached to this section
			if (tableView__ == nullptr) {
				return;
			}
			tableView__->fireTableViewSectionEvent(event_name, get_object().GetPrivate<TableViewSection>(), rowIndex);
		}

		void TableViewSection::JSExportInitialize() 
		{
			JSExport<TableViewSection>::SetClassVersion(1);
			JSExport<TableViewSection>::SetParent(JSExport<Module>::Class());

			TITANIUM_ADD_PROPERTY(TableViewSection, footerTitle);
			TITANIUM_ADD_PROPERTY(TableViewSection, footerView);
			TITANIUM_ADD_PROPERTY(TableViewSection, headerTitle);
			TITANIUM_ADD_PROPERTY(TableViewSection, headerView);
			TITANIUM_ADD_PROPERTY_READONLY(TableViewSection, rowCount);
			TITANIUM_ADD_PROPERTY_READONLY(TableViewSection, rows);

			TITANIUM_ADD_FUNCTION(TableViewSection, add);
			TITANIUM_ADD_FUNCTION(TableViewSection, remove);
			TITANIUM_ADD_FUNCTION(TableViewSection, rowAtIndex);
			TITANIUM_ADD_FUNCTION(TableViewSection, getFooterTitle);
			TITANIUM_ADD_FUNCTION(TableViewSection, setFooterTitle);
			TITANIUM_ADD_FUNCTION(TableViewSection, getFooterView);
			TITANIUM_ADD_FUNCTION(TableViewSection, setFooterView);
			TITANIUM_ADD_FUNCTION(TableViewSection, getHeaderTitle);
			TITANIUM_ADD_FUNCTION(TableViewSection, setHeaderTitle);
			TITANIUM_ADD_FUNCTION(TableViewSection, getHeaderView);
			TITANIUM_ADD_FUNCTION(TableViewSection, setHeaderView);
			TITANIUM_ADD_FUNCTION(TableViewSection, getRowCount);
			TITANIUM_ADD_FUNCTION(TableViewSection, getRows);
		}

		TITANIUM_PROPERTY_GETTER_STRING(TableViewSection, footerTitle)
		TITANIUM_PROPERTY_SETTER_STRING(TableViewSection, footerTitle)
		TITANIUM_PROPERTY_GETTER_OBJECT(TableViewSection, footerView)
		TITANIUM_PROPERTY_SETTER_OBJECT(TableViewSection, footerView, View)
		TITANIUM_PROPERTY_GETTER_STRING(TableViewSection, headerTitle)
		TITANIUM_PROPERTY_SETTER_STRING(TableViewSection, headerTitle)
		TITANIUM_PROPERTY_GETTER_OBJECT(TableViewSection, headerView)
		TITANIUM_PROPERTY_SETTER_OBJECT(TableViewSection, headerView, View)
		TITANIUM_PROPERTY_GETTER_UINT(TableViewSection, rowCount)

		TITANIUM_PROPERTY_GETTER_OBJECT_ARRAY(TableViewSection, rows)

		TITANIUM_FUNCTION(TableViewSection, add)
		{
			ENSURE_OBJECT_AT_INDEX(row, 0)
			add(row.GetPrivate<TableViewRow>());
			return get_context().CreateUndefined();
		}

		TITANIUM_FUNCTION(TableViewSection, remove)
		{
			ENSURE_OBJECT_AT_INDEX(row, 0)
			remove(row.GetPrivate<TableViewRow>());
			return get_context().CreateUndefined();
		}

		TITANIUM_FUNCTION(TableViewSection, rowAtIndex)
		{
			ENSURE_UINT_AT_INDEX(index, 0)
			const auto row = rowAtIndex(index);
			if (row != nullptr) {
				return row->get_object();
			}
			return get_context().CreateUndefined();
		}

		TITANIUM_FUNCTION_AS_GETTER(TableViewSection, getFooterTitle, footerTitle)
		TITANIUM_FUNCTION_AS_SETTER(TableViewSection, setFooterTitle, footerTitle)
		TITANIUM_FUNCTION_AS_GETTER(TableViewSection, getFooterView, footerView)
		TITANIUM_FUNCTION_AS_SETTER(TableViewSection, setFooterView, footerView)
		TITANIUM_FUNCTION_AS_GETTER(TableViewSection, getHeaderTitle, headerTitle)
		TITANIUM_FUNCTION_AS_SETTER(TableViewSection, setHeaderTitle, headerTitle)
		TITANIUM_FUNCTION_AS_GETTER(TableViewSection, getHeaderView, headerView)
		TITANIUM_FUNCTION_AS_SETTER(TableViewSection, setHeaderView, headerView)
		TITANIUM_FUNCTION_AS_GETTER(TableViewSection, getRowCount, rowCount)
		TITANIUM_FUNCTION_AS_GETTER(TableViewSection, getRows, rows)
	} // namespace UI
} // namespace Titanium