export type AuditAction =
  | 'create'
  | 'update'
  | 'approve'
  | 'reject'
  | 'suspend'
  | 'override'
  | 'export';

export interface AuditEntry {
  id: string;
  action: AuditAction;
  actorName: string;
  actorId?: string;
  entityType: string;
  entityId: string;
  reason?: string;
  beforeSummary?: string;
  afterSummary?: string;
  correlationId?: string;
  occurredAt: string;
}
