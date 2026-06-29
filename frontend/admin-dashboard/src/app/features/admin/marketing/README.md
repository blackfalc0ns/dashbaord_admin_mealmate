# Admin — Marketing Module (F004 + F18)

## Routes

| Page | Path |
|------|------|
| Overview | `/admin/marketing` |
| Influencers list | `/admin/marketing/influencers` |
| Influencer detail | `/admin/marketing/influencers/:id` |
| Campaigns | `/admin/marketing/campaigns` |
| Promo codes | `/admin/marketing/promo-codes` |
| Ads bidding | `/admin/marketing/ads` |
| Reports | `/admin/marketing/reports` |

## Permissions

- `marketing:view` — read access
- `marketing:manage` — create/edit influencers, codes, campaigns
- `marketing:commissions` — commission payout (future)

## Data

Mock data in `data/marketing-mock.data.ts` via `MarketingStore`. `InfluencersApiService` is a stub until backend F004 endpoints ship.
