import { applyManualCancellationFee, computeRefundableBase } from './cancellation-formulas';

describe('cancellation-formulas', () => {
  it('computes remaining refundable days with operational deduction', () => {
    const result = computeRefundableBase(140, 26, 10, 3);
    expect(result.remainingRefundableDays).toBe(13);
    expect(result.refundableBaseKd).toBeCloseTo(70, 1);
  });

  it('returns zero refundable when operational deduction consumes remaining days', () => {
    const result = computeRefundableBase(88, 26, 22, 3);
    expect(result.remainingRefundableDays).toBe(1);
  });

  it('applies admin-set cancellation fee percentage', () => {
    const { cancellationFeeKd, netRefundKd } = applyManualCancellationFee(70, 10);
    expect(cancellationFeeKd).toBeCloseTo(7, 2);
    expect(netRefundKd).toBeCloseTo(63, 2);
  });

  it('clamps fee percentage between 0 and 100', () => {
    const high = applyManualCancellationFee(100, 150);
    expect(high.cancellationFeeKd).toBe(100);
    const low = applyManualCancellationFee(100, -5);
    expect(low.cancellationFeeKd).toBe(0);
  });
});
