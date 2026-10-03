/**
 * Client-side persistent draft storage for address, cart, and order reservations.
 * Resilient against network drops, page refreshes, and app closures.
 */

import { CustomerAddress } from '../../shared/types.ts';

const ADDRESS_DRAFT_KEY = 'onemart_address_draft_v1';
const GUEST_TOKEN_KEY = 'onemart_guest_token_v1';
const ACTIVE_RESERVATION_KEY = 'onemart_reservation_v1';

export function saveAddressDraft(address: CustomerAddress): void {
  try {
    localStorage.setItem(ADDRESS_DRAFT_KEY, JSON.stringify(address));
  } catch (e) {
    console.warn('Unable to persist address draft to localStorage', e);
  }
}

export function loadAddressDraft(): CustomerAddress | null {
  try {
    const raw = localStorage.getItem(ADDRESS_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getOrCreateGuestToken(): string {
  try {
    let token = localStorage.getItem(GUEST_TOKEN_KEY);
    if (!token) {
      token = 'gst_' + Math.random().toString(36).substring(2, 12);
      localStorage.setItem(GUEST_TOKEN_KEY, token);
    }
    return token;
  } catch {
    return 'gst_fallback_' + Date.now();
  }
}

export function saveActiveReservation(data: { reservationId: string; expiresAt: number }): void {
  try {
    localStorage.setItem(ACTIVE_RESERVATION_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Unable to save reservation', e);
  }
}

export function loadActiveReservation(): { reservationId: string; expiresAt: number } | null {
  try {
    const raw = localStorage.getItem(ACTIVE_RESERVATION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearActiveReservation(): void {
  try {
    localStorage.removeItem(ACTIVE_RESERVATION_KEY);
  } catch (e) {
    console.warn('Unable to clear reservation', e);
  }
}
