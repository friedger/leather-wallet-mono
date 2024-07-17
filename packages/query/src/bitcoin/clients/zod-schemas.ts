import { z } from 'zod';

export const runeTickerInfoSchema = z.object({
  rune_id: z.string(),
  rune_number: z.string(),
  rune_name: z.string(),
  spaced_rune_name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  per_mint_amount: z.string().or(z.number()),
  mint_cnt: z.string(),
  mint_cnt_limit: z.string().or(z.number()),
  premined_supply: z.string(),
  total_minted_supply: z.string(),
  burned_supply: z.string(),
  circulating_supply: z.string(),
  mint_progress: z.number(),
  mint_start_block: z.number().nullable().optional(),
  mint_end_block: z.number().nullable().optional(),
  genesis_block: z.number(),
  deploy_ts: z.string(),
  deploy_txid: z.string(),
  auto_upgrade: z.boolean(),
  holder_count: z.number(),
  event_count: z.number(),
  mintable: z.boolean(),
  icon_inscr_id: z.string().nullable(),
  icon_delegate_id: z.string().nullable().optional(),
  icon_content_url: z.string().nullable(),
  icon_render_url: z.string().nullable().optional(),
  avg_unit_price_in_sats: z.number().nullable(),
  min_listed_unit_price_in_sats: z.number().nullable(),
  min_listed_unit_price_unisat: z.number().nullable(),
  listed_supply: z.string().or(z.number()),
  listed_supply_ratio: z.number(),
  marketcap: z.number().nullable(),
  total_sale_info: z.object({
    sale_count: z.number(),
    sale_amount: z.string().or(z.number()),
    vol_3h: z.number(),
    vol_6h: z.number(),
    vol_9h: z.number(),
    vol_12h: z.number(),
    vol_1d: z.number(),
    vol_3d: z.number(),
    vol_7d: z.number(),
    vol_30d: z.number(),
    vol_total: z.number(),
  }),
});

const bestInSlotInscriptionDelegateSchema = z.object({
  delegate_id: z.string(),
  render_url: z.string().nullable().optional(),
  mime_type: z.string().nullable().optional(),
  content_url: z.string(),
  bis_url: z.string(),
});

export const bestInSlotInscriptionSchema = z.object({
  inscription_name: z.string().nullable().optional(),
  inscription_id: z.string(),
  inscription_number: z.number(),
  parent_ids: z.array(z.string()),
  metadata: z.any().nullable(),
  owner_wallet_addr: z.string(),
  mime_type: z.string().nullable().optional(),
  last_sale_price: z.number().nullable().optional(),
  slug: z.string().nullable().optional(),
  collection_name: z.string().nullable().optional(),
  satpoint: z.string(),
  last_transfer_block_height: z.number().nullable().optional(),
  genesis_height: z.number(),
  content_url: z.string(),
  bis_url: z.string(),
  render_url: z.string().nullable().optional(),
  bitmap_number: z.number().nullable().optional(),
  delegate: bestInSlotInscriptionDelegateSchema.nullable().optional(),
});

export const inscriptionsByAddressSchema = z.object({
  block_height: z.number(),
  data: z.array(bestInSlotInscriptionSchema),
});