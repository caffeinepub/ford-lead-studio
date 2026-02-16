import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface OfferDetails {
    mileage: bigint;
    discount: bigint;
    price: bigint;
}
export type Time = bigint;
export interface VideoAsset {
    id: bigint;
    url: string;
    status: string;
    duration: bigint;
    prompt: string;
    aspectRatio: string;
}
export interface Lead {
    id: bigint;
    status: LeadStatus;
    contactInfo: string;
    consent: boolean;
    timeframe: string;
    name: string;
    notes: Array<string>;
    contentPackageId: bigint;
    vehicleInterest: string;
    nextFollowUpDate: Time;
}
export interface ContentPackage {
    id: bigint;
    cta: CTA;
    model: Model;
    hashtags: Array<string>;
    createdAt: Time;
    createdBy: string;
    tone: Tone;
    platform: Platform;
    campaignObjective: CampaignObjective;
    offerDetails: OfferDetails;
    caption: string;
    videoAssets: Array<VideoAsset>;
    postingChecklist: Array<string>;
    shotList: Array<string>;
}
export interface UserProfile {
    name: string;
}
export enum CTA {
    scheduleTestDrive = "scheduleTestDrive",
    visitDealership = "visitDealership",
    getQuote = "getQuote"
}
export enum CampaignObjective {
    leadGeneration = "leadGeneration",
    testDrive = "testDrive",
    brandAwareness = "brandAwareness"
}
export enum LeadStatus {
    new_ = "new",
    won = "won",
    lost = "lost",
    testDriveScheduled = "testDriveScheduled",
    contacted = "contacted",
    qualified = "qualified"
}
export enum Model {
    mustang = "mustang",
    f150 = "f150",
    explorer = "explorer"
}
export enum Platform {
    tiktok = "tiktok",
    instagram = "instagram",
    facebook = "facebook"
}
export enum Tone {
    communityFocused = "communityFocused",
    excited = "excited",
    trustedAdvisor = "trustedAdvisor"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addHashtagsToContentPackage(id: bigint, hashtags: Array<string>): Promise<void>;
    addLeadNote(id: bigint, note: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createContentPackage(contentPackage: ContentPackage): Promise<void>;
    createExternalContentPackage(contentPackage: ContentPackage): Promise<void>;
    createLead(lead: Lead): Promise<void>;
    getAllContentPackageIds(): Promise<Array<bigint>>;
    getAllContentPackages(): Promise<Array<ContentPackage>>;
    getAllLeads(): Promise<Array<Lead>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContentPackage(id: bigint): Promise<ContentPackage | null>;
    getContentPackageCount(): Promise<bigint>;
    getContentPackagesByCreator(_creator: string): Promise<Array<ContentPackage>>;
    getExternalContentPackage(id: bigint): Promise<ContentPackage | null>;
    getExternalContentPackages(): Promise<Array<ContentPackage>>;
    getLeadCount(): Promise<bigint>;
    getLeads(): Promise<Array<Lead>>;
    getNextContentPackageId(): Promise<bigint>;
    getNextLeadId(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeVideoAsset(contentPackageId: bigint, videoId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveExternalVideoAsset(id: bigint, video: VideoAsset): Promise<void>;
    saveVideoAsset(id: bigint, video: VideoAsset): Promise<void>;
    updateExternalContentPackage(_id: bigint, contentPackage: ContentPackage): Promise<void>;
    updateLeadStatus(id: bigint, status: LeadStatus): Promise<void>;
    updateVideoAssetStatus(contentPackageId: bigint, videoId: bigint, newStatus: string): Promise<void>;
}
