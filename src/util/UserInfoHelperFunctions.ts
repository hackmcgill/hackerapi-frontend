import { Account, Hacker } from '../api';

import { HackerStatus, IAccount, IHacker, UserType } from '../config';

import * as QRCode from 'qrcode';

import jsPDF from 'jspdf';

export function userCanAccessCreateApplicationPage(user: IAccount) {
  return user.confirmed && user.accountType === UserType.HACKER;
}

export async function isLoggedIn(): Promise<boolean> {
  try {
    const userInfo = await getUserInfo();
    return Boolean(userInfo);
  } catch (error) {
    return false;
  }
}

/**
 * Returns whether the current user is confirmed
 */
export async function isConfirmed(): Promise<boolean> {
  try {
    const response = await Account.getSelf();
    const user = response.data.data;
    return Boolean(user) && user.confirmed;
  } catch (error) {
    return false;
  }
}

export async function getUserInfo(): Promise<IAccount | null> {
  try {
    const response = await Account.getSelf();
    return response.data.data;
  } catch (error) {
    return null;
  }
}

export async function getHackerInfo(): Promise<IHacker | null> {
  try {
    const response = await Hacker.getSelf();
    return response.data.data;
  } catch (error) {
    return null;
  }
}
export function isAppOpen(): boolean {
  return false;
}

export function canAccessApplication(hacker?: IHacker): boolean {
  const APPS_OPEN = isAppOpen();
  const status = hacker ? hacker.status : HackerStatus.HACKER_STATUS_NONE;

  return (
    APPS_OPEN &&
    (status === HackerStatus.HACKER_STATUS_NONE ||
      status === HackerStatus.HACKER_STATUS_APPLIED)
  );
}

export function canAccessTeam(hacker?: IHacker): boolean {
  const status = hacker ? hacker.status : HackerStatus.HACKER_STATUS_NONE;

  return (
    status === HackerStatus.HACKER_STATUS_APPLIED ||
    status === HackerStatus.HACKER_STATUS_ACCEPTED ||
    status === HackerStatus.HACKER_STATUS_CONFIRMED ||
    status === HackerStatus.HACKER_STATUS_CHECKED_IN
  );
}

export function canAccessBus(hacker?: IHacker): boolean {
  return hacker ? Boolean(hacker.needsBus) : false;
}

export function canAccessHackerPass(hacker?: IHacker): boolean {
  const status = hacker ? hacker.status : HackerStatus.HACKER_STATUS_NONE;

  return (
    // status === HackerStatus.HACKER_STATUS_APPLIED ||
    status === HackerStatus.HACKER_STATUS_ACCEPTED ||
    status === HackerStatus.HACKER_STATUS_CONFIRMED ||
    status === HackerStatus.HACKER_STATUS_CANCELLED ||
    status === HackerStatus.HACKER_STATUS_CHECKED_IN
  );
}

/**
 * Generate a QR code for a given hacker.
 * @param hacker The hacker you wanna generate the code for
 * @returns an svg string.
 */
export async function generateHackerQRCode(hacker: IHacker): Promise<string> {
  const response = await QRCode.toDataURL(hacker.id, { scale: 10 });
  return response;
}

/**
 * Generate a QR code for a given hacker.
 * @param hacker The hacker you wanna generate the code for
 * @returns an svg string.
 */
export async function generateHackPass(
  account: IAccount,
  hacker: IHacker
): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [59, 102],
  });
  const qrData = await generateHackerQRCode(hacker);
  doc.addImage(qrData, 'png', 0, 15, 21, 21);

  doc.setFontSize(9);
  const name: string[] = doc.splitTextToSize(account.firstName, 18);
  doc.text(2, 4, name);

  doc.setFontSize(2);
  const pronoun: string[] = doc.splitTextToSize(account.pronoun, 18);
  const school: string[] = doc.splitTextToSize(hacker.school, 18);
  const email: string[] = doc.splitTextToSize(account.email, 18);
  doc.text(2, 5, pronoun.concat(school).concat(email));

  doc.autoPrint();
  doc.save(`hackPass_${hacker.id}.pdf`);
  return doc;
}
