import { useObjectMetadataItemById } from '@/object-metadata/hooks/useObjectMetadataItemById';
import { availableFieldMetadataItemsForFilterFamilySelector } from '@/object-metadata/states/availableFieldMetadataItemsForFilterFamilySelector';
import { getFilterTypeFromFieldType } from '@/object-metadata/utils/formatFieldMetadataItemsAsFilterDefinitions';
import { useUpsertCombinedViewFilterGroup } from '@/object-record/advanced-filter/hooks/useUpsertCombinedViewFilterGroup';
import { useUpsertRecordFilterGroup } from '@/object-record/record-filter-group/hooks/useUpsertRecordFilterGroup';
import { RecordFilterGroup } from '@/object-record/record-filter-group/types/RecordFilterGroup';
import { RecordFilterGroupLogicalOperator } from '@/object-record/record-filter-group/types/RecordFilterGroupLogicalOperator';
import { useUpsertRecordFilter } from '@/object-record/record-filter/hooks/useUpsertRecordFilter';
import { getRecordFilterOperands } from '@/object-record/record-filter/utils/getRecordFilterOperands';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { useDropdown } from '@/ui/layout/dropdown/hooks/useDropdown';
import { ADVANCED_FILTER_DROPDOWN_ID } from '@/views/constants/AdvancedFilterDropdownId';
import { useGetCurrentView } from '@/views/hooks/useGetCurrentView';
import { ViewFilterGroup } from '@/views/types/ViewFilterGroup';
import { ViewFilterGroupLogicalOperator } from '@/views/types/ViewFilterGroupLogicalOperator';
import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { isDefined } from 'twenty-shared';
import { IconLibraryPlus, IconPlus, LightButton, MenuItem } from 'twenty-ui';
import { v4 } from 'uuid';

type AdvancedFilterAddFilterRuleSelectProps = {
  viewFilterGroup: ViewFilterGroup;
  lastChildPosition?: number;
};

export const AdvancedFilterAddFilterRuleSelect = ({
  viewFilterGroup,
  lastChildPosition = 0,
}: AdvancedFilterAddFilterRuleSelectProps) => {
  const dropdownId = `advanced-filter-add-filter-rule-${viewFilterGroup.id}`;

  const { currentViewId } = useGetCurrentView();

  const { upsertCombinedViewFilterGroup } = useUpsertCombinedViewFilterGroup();
  const { upsertRecordFilterGroup } = useUpsertRecordFilterGroup();

  const { upsertRecordFilter } = useUpsertRecordFilter();

  const newPositionInViewFilterGroup = lastChildPosition + 1;

  const { closeDropdown } = useDropdown(dropdownId);

  const { currentViewWithCombinedFiltersAndSorts } = useGetCurrentView();

  const objectMetadataId =
    currentViewWithCombinedFiltersAndSorts?.objectMetadataId;

  if (!isDefined(objectMetadataId)) {
    throw new Error('Object metadata id is missing from current view');
  }

  const { objectMetadataItem } = useObjectMetadataItemById({
    objectId: objectMetadataId,
  });

  const availableFieldMetadataItemsForFilter = useRecoilValue(
    availableFieldMetadataItemsForFilterFamilySelector({
      objectMetadataItemId: objectMetadataId,
    }),
  );

  const getDefaultFieldMetadataItem = useCallback(() => {
    const defaultFieldMetadataItem =
      availableFieldMetadataItemsForFilter.find(
        (fieldMetadataItem) =>
          fieldMetadataItem.id ===
          objectMetadataItem?.labelIdentifierFieldMetadataId,
      ) ?? availableFieldMetadataItemsForFilter[0];

    if (!isDefined(defaultFieldMetadataItem)) {
      throw new Error(
        `Could not find default field metadata item for object ${objectMetadataId}`,
      );
    }

    return defaultFieldMetadataItem;
  }, [
    availableFieldMetadataItemsForFilter,
    objectMetadataItem,
    objectMetadataId,
  ]);

  const handleAddFilter = () => {
    closeDropdown();

    const defaultFieldMetadataItem = getDefaultFieldMetadataItem();

    const filterType = getFilterTypeFromFieldType(
      defaultFieldMetadataItem.type,
    );

    upsertRecordFilter({
      id: v4(),
      fieldMetadataId: defaultFieldMetadataItem.id,
      type: filterType,
      operand: getRecordFilterOperands({
        filterType,
      })[0],
      value: '',
      displayValue: '',
      viewFilterGroupId: viewFilterGroup.id,
      positionInViewFilterGroup: newPositionInViewFilterGroup,
      label: defaultFieldMetadataItem.label,
    });
  };

  const handleAddFilterGroup = () => {
    closeDropdown();

    if (!currentViewId) {
      throw new Error('Missing view id');
    }

    const newRecordFilterGroupId = v4();

    const newViewFilterGroup: ViewFilterGroup = {
      __typename: 'ViewFilterGroup',
      id: newRecordFilterGroupId,
      viewId: currentViewId,
      logicalOperator: ViewFilterGroupLogicalOperator.AND,
      parentViewFilterGroupId: viewFilterGroup.id,
      positionInViewFilterGroup: newPositionInViewFilterGroup,
    };

    const newRecordFilterGroup: RecordFilterGroup = {
      id: newRecordFilterGroupId,
      logicalOperator: RecordFilterGroupLogicalOperator.AND,
      parentRecordFilterGroupId: viewFilterGroup.id,
      positionInRecordFilterGroup: newPositionInViewFilterGroup,
    };

    upsertCombinedViewFilterGroup(newViewFilterGroup);
    upsertRecordFilterGroup(newRecordFilterGroup);

    const defaultFieldMetadataItem = getDefaultFieldMetadataItem();

    const filterType = getFilterTypeFromFieldType(
      defaultFieldMetadataItem.type,
    );

    upsertRecordFilter({
      id: v4(),
      fieldMetadataId: defaultFieldMetadataItem.id,
      type: filterType,
      operand: getRecordFilterOperands({
        filterType,
      })[0],
      value: '',
      displayValue: '',
      viewFilterGroupId: newViewFilterGroup.id,
      positionInViewFilterGroup: newPositionInViewFilterGroup,
      label: defaultFieldMetadataItem.label,
    });
  };

  const isFilterRuleGroupOptionVisible = !isDefined(
    viewFilterGroup.parentViewFilterGroupId,
  );

  if (!isFilterRuleGroupOptionVisible) {
    return (
      <LightButton
        Icon={IconPlus}
        title="Add filter rule"
        onClick={handleAddFilter}
      />
    );
  }

  return (
    <Dropdown
      dropdownId={dropdownId}
      clickableComponent={
        <LightButton Icon={IconPlus} title="Add filter rule" />
      }
      dropdownComponents={
        <DropdownMenuItemsContainer>
          <MenuItem
            LeftIcon={IconPlus}
            text="Add rule"
            onClick={handleAddFilter}
          />
          {isFilterRuleGroupOptionVisible && (
            <MenuItem
              LeftIcon={IconLibraryPlus}
              text="Add rule group"
              onClick={handleAddFilterGroup}
            />
          )}
        </DropdownMenuItemsContainer>
      }
      dropdownHotkeyScope={{ scope: ADVANCED_FILTER_DROPDOWN_ID }}
      dropdownOffset={{ y: 8, x: 0 }}
      dropdownPlacement="bottom-start"
    />
  );
};
