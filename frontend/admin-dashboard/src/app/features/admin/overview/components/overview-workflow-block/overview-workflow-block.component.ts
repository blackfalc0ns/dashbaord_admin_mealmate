import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ZardCardComponent } from '../../../../../shared/components/card/card.component';
import { OverviewWorkflowBlock } from '../../models/overview.model';

@Component({
  selector: 'mm-overview-workflow-block',
  standalone: true,
  imports: [ZardCardComponent, RouterLink],
  templateUrl: './overview-workflow-block.component.html',
  styleUrl: './overview-workflow-block.component.scss',
})
export class OverviewWorkflowBlockComponent {
  readonly locale = inject(AppLocaleService);
  readonly block = input.required<OverviewWorkflowBlock>();

  readonly title = computed(() =>
    this.locale.isRtl() ? this.block().titleAr : this.block().titleEn,
  );

  readonly goal = computed(() =>
    this.locale.isRtl() ? this.block().goalAr : this.block().goalEn,
  );

  readonly steps = computed(() =>
    this.locale.isRtl() ? this.block().stepsAr : this.block().stepsEn,
  );

  readonly rules = computed(() =>
    this.locale.isRtl() ? this.block().rulesAr : this.block().rulesEn,
  );

  readonly routeLabel = computed(() => {
    const b = this.block();
    if (!b.route) {
      return null;
    }
    return this.locale.isRtl() ? b.routeLabelAr : b.routeLabelEn;
  });

  readonly stepsHeading = computed(() => (this.locale.isRtl() ? 'خطوات Workflow' : 'Workflow steps'));
  readonly rulesHeading = computed(() => (this.locale.isRtl() ? 'قواعد وقيود' : 'Rules & constraints'));
}
