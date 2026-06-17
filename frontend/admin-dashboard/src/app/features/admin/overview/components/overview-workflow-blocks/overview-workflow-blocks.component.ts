import { Component, computed, input } from '@angular/core';

import { OverviewTabId, OverviewWorkflowBlock } from '../../models/overview.model';
import { OverviewWorkflowBlockComponent } from '../overview-workflow-block/overview-workflow-block.component';

@Component({
  selector: 'mm-overview-workflow-blocks',
  standalone: true,
  imports: [OverviewWorkflowBlockComponent],
  templateUrl: './overview-workflow-blocks.component.html',
  styleUrl: './overview-workflow-blocks.component.scss',
})
export class OverviewWorkflowBlocksComponent {
  readonly blocks = input.required<OverviewWorkflowBlock[]>();
  readonly tabId = input.required<OverviewTabId>();

  readonly visibleBlocks = computed(() =>
    this.blocks().filter((b) => b.tabId === this.tabId()),
  );
}
