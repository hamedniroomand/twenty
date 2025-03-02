import styled from '@emotion/styled';
import {
  AnimatedPlaceholder,
  AnimatedPlaceholderEmptyContainer,
  AnimatedPlaceholderEmptySubTitle,
  AnimatedPlaceholderEmptyTextContainer,
  AnimatedPlaceholderEmptyTitle,
  Button,
  EMPTY_PLACEHOLDER_TRANSITION_PROPS,
  IconPlus,
} from 'twenty-ui';

import { SkeletonLoader } from '@/activities/components/SkeletonLoader';
import { useOpenCreateActivityDrawer } from '@/activities/hooks/useOpenCreateActivityDrawer';
import { TASKS_TAB_LIST_COMPONENT_ID } from '@/activities/tasks/constants/TasksTabListComponentId';
import { useTasks } from '@/activities/tasks/hooks/useTasks';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { Task } from '@/activities/types/Task';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useHasObjectReadOnlyPermission } from '@/settings/roles/hooks/useHasObjectReadOnlyPermission';
import { useTabList } from '@/ui/layout/tab/hooks/useTabList';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import groupBy from 'lodash.groupby';
import { AddTaskButton } from './AddTaskButton';
import { TaskList } from './TaskList';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

type TaskGroupsProps = {
  filterDropdownId?: string;
  targetableObjects?: ActivityTargetableObject[];
};

export const TaskGroups = ({ targetableObjects }: TaskGroupsProps) => {
  const { tasks, tasksLoading } = useTasks({
    targetableObjects: targetableObjects ?? [],
  });

  const hasObjectReadOnlyPermission = useHasObjectReadOnlyPermission();

  const openCreateActivity = useOpenCreateActivityDrawer({
    activityObjectNameSingular: CoreObjectNameSingular.Task,
  });

  const { activeTabId } = useTabList(TASKS_TAB_LIST_COMPONENT_ID);

  const isLoading =
    (activeTabId !== 'done' && tasksLoading) ||
    (activeTabId === 'done' && tasksLoading);

  const isTasksEmpty =
    (activeTabId !== 'done' && tasks?.length === 0) ||
    (activeTabId === 'done' && tasks?.length === 0);

  if (isLoading && isTasksEmpty) {
    return <SkeletonLoader />;
  }

  if (isTasksEmpty) {
    return (
      <AnimatedPlaceholderEmptyContainer
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...EMPTY_PLACEHOLDER_TRANSITION_PROPS}
      >
        <AnimatedPlaceholder type="noTask" />
        <AnimatedPlaceholderEmptyTextContainer>
          <AnimatedPlaceholderEmptyTitle>
            <Trans>Mission accomplished!</Trans>
          </AnimatedPlaceholderEmptyTitle>
          <AnimatedPlaceholderEmptySubTitle>
            <Trans>All tasks addressed. Maintain the momentum.</Trans>
          </AnimatedPlaceholderEmptySubTitle>
        </AnimatedPlaceholderEmptyTextContainer>
        {!hasObjectReadOnlyPermission && (
          <Button
            Icon={IconPlus}
            title={t`New task`}
            variant={'secondary'}
            onClick={() =>
              openCreateActivity({
                targetableObjects: targetableObjects ?? [],
              })
            }
          />
        )}
      </AnimatedPlaceholderEmptyContainer>
    );
  }

  const sortedTasksByStatus = Object.entries(
    groupBy(tasks, ({ status }) => status),
  ).sort(([statusA], [statusB]) => statusB.localeCompare(statusA));

  const hasTodoStatus = sortedTasksByStatus.some(
    ([status]) => status === 'TODO',
  );

  return (
    <StyledContainer>
      {sortedTasksByStatus.map(([status, tasksByStatus]: [string, Task[]]) => (
        <TaskList
          key={status}
          title={status}
          tasks={tasksByStatus}
          button={
            (status === 'TODO' || !hasTodoStatus) && (
              <AddTaskButton activityTargetableObjects={targetableObjects} />
            )
          }
        />
      ))}
    </StyledContainer>
  );
};
