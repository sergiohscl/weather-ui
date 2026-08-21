import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Subject,
  defer,
  timer,
} from 'rxjs';

import {
  expand,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';

import { InsightService } from '../../../../core/services/insight.service';

import {
  WeatherInsightResponse,
} from '../../../../core/models/insight.model';

@Component({
  selector: 'app-weather-insight',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-insight.component.html',
})
export class WeatherInsightComponent implements OnChanges {

  private readonly insightService = inject(InsightService);

  @Input({ required: true })
  city!: string;

  insight: WeatherInsightResponse | null = null;

  insightLoading = false;

  insightError = '';

  
  private readonly initialPollingDelay = 1000;
  
  private readonly pollingStep = 1000;
  
  private readonly maxPollingAttempts = 10;
 
  private requestId = 0;
  
  private readonly cancelPolling$ = new Subject<void>();

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['city']?.currentValue &&
      changes['city'].currentValue !== changes['city'].previousValue
    ) {
      this.loadInsight();
    }
  }

  private loadInsight(): void {

    const city = this.city?.trim();

    if (!city) {
      return;
    }
    
    this.cancelPolling$.next();

    const currentRequestId = ++this.requestId;

    this.insight = null;

    this.insightError = '';

    this.insightLoading = true;

    this.insightService
      .generateInsight({
        city,
        hours: 24,
      })
      .pipe(
        takeUntil(this.cancelPolling$),
      )
      .subscribe({

        next: (taskResponse) => {

          if (currentRequestId !== this.requestId) {
            return;
          }

          this.pollInsightTask(
            taskResponse.task_id,
            currentRequestId,
          );
        },

        error: (error) => {

          if (currentRequestId !== this.requestId) {
            return;
          }

          console.error(
            'Erro ao gerar insight:',
            error,
          );

          this.insightError =
            error?.error?.detail ??
            'Não foi possível gerar o insight.';

          this.insightLoading = false;
        },
      });
  }

  private pollInsightTask(
    taskId: string,
    currentRequestId: number,
  ): void {

    defer(() =>
      this.insightService.getInsightTaskStatus(taskId),
    )
      .pipe(
       
        takeUntil(this.cancelPolling$),
        
        expand((taskStatus, attempt) => {

          if (
            taskStatus.status === 'SUCCESS' ||
            taskStatus.status === 'FAILURE'
          ) {
            return [];
          }

          if (
            attempt + 1 >= this.maxPollingAttempts
          ) {
            return [];
          }

          const delay =
            this.initialPollingDelay +
            attempt * this.pollingStep;

          return timer(delay).pipe(
            switchMap(() =>
              this.insightService
                .getInsightTaskStatus(taskId),
            ),
          );
        }),

        take(this.maxPollingAttempts),
      )
      .subscribe({

        next: (taskStatus) => {

          if (
            currentRequestId !== this.requestId
          ) {
            return;
          }

          if (
            taskStatus.status === 'PENDING' ||
            taskStatus.status === 'STARTED'
          ) {
            return;
          }

          if (
            taskStatus.status === 'SUCCESS'
          ) {

            if (!taskStatus.result) {

              this.insightError =
                'A geração foi concluída, mas nenhum insight foi retornado.';

              this.insightLoading = false;

              return;
            }

            this.insight =
              taskStatus.result;

            this.insightLoading = false;

            return;
          }

          if (
            taskStatus.status === 'FAILURE'
          ) {

            console.error(
              'Task de insight falhou:',
              taskStatus,
            );

            this.insightError =
              'Ocorreu um erro durante a geração do insight.';

            this.insightLoading = false;
          }
        },

        error: (error) => {

          if (
            currentRequestId !== this.requestId
          ) {
            return;
          }

          console.error(
            'Erro ao consultar status da task:',
            error,
          );

          this.insightError =
            error?.error?.detail ??
            'Não foi possível consultar o processamento do insight.';

          this.insightLoading = false;
        },

        complete: () => {

          if (
            currentRequestId === this.requestId &&
            this.insightLoading
          ) {

            this.insightError =
              'O insight ainda está sendo processado. Tente novamente em alguns instantes.';

            this.insightLoading = false;
          }
        },
      });
  }
}