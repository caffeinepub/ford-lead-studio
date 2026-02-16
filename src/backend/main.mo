import Map "mo:core/Map";
import Blob "mo:core/Blob";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  let contentPackages = Map.empty<Nat, ContentPackage>();
  let leads = Map.empty<Nat, Lead>();
  var nextContentPackageId = 0;
  var nextLeadId = 0;
  let externalContentPackages = Map.empty<Nat, ContentPackage>();

  // Initialize Access Control system with admin
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  let userProfiles = Map.empty<Principal, UserProfile>();

  public type UserProfile = {
    name : Text;
  };

  public type Platform = {
    #facebook;
    #instagram;
    #tiktok;
  };

  public type CampaignObjective = {
    #brandAwareness;
    #leadGeneration;
    #testDrive;
  };

  public type Model = {
    #f150;
    #mustang;
    #explorer;
  };

  public type OfferDetails = {
    price : Nat;
    discount : Nat;
    mileage : Nat;
  };

  public type Tone = {
    #excited;
    #trustedAdvisor;
    #communityFocused;
  };

  public type CTA = {
    #visitDealership;
    #scheduleTestDrive;
    #getQuote;
  };

  public type ContentPackage = {
    id : Nat;
    platform : Platform;
    campaignObjective : CampaignObjective;
    model : Model;
    offerDetails : OfferDetails;
    tone : Tone;
    cta : CTA;
    caption : Text;
    hashtags : [Text];
    shotList : [Text];
    postingChecklist : [Text];
    videoAssets : [VideoAsset];
    createdBy : Text;
    createdAt : Time.Time;
  };

  public type VideoAsset = {
    id : Nat;
    url : Text;
    prompt : Text;
    duration : Nat;
    aspectRatio : Text;
    status : Text;
  };

  public type Lead = {
    id : Nat;
    name : Text;
    contactInfo : Text;
    vehicleInterest : Text;
    timeframe : Text;
    consent : Bool;
    contentPackageId : Nat;
    status : LeadStatus;
    notes : [Text];
    nextFollowUpDate : Time.Time;
  };

  public type LeadStatus = {
    #new;
    #contacted;
    #qualified;
    #testDriveScheduled;
    #won;
    #lost;
  };

  module ContentPackageSort {
    public func compare(a : ContentPackage, b : ContentPackage) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Content Package Management
  public query ({ caller }) func getNextContentPackageId() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access content packages");
    };
    nextContentPackageId;
  };

  public query ({ caller }) func getNextLeadId() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access leads");
    };
    nextLeadId;
  };

  public shared ({ caller }) func createContentPackage(contentPackage : ContentPackage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create content packages");
    };
    contentPackages.add(contentPackage.id, contentPackage);
    nextContentPackageId += 1;
  };

  public shared ({ caller }) func createExternalContentPackage(contentPackage : ContentPackage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create external content packages");
    };
    externalContentPackages.add(contentPackage.id, contentPackage);
    nextContentPackageId += 1;
  };

  public shared ({ caller }) func updateExternalContentPackage(_id : Nat, contentPackage : ContentPackage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update external content packages");
    };
    externalContentPackages.add(contentPackage.id, contentPackage);
  };

  public query ({ caller }) func getAllContentPackages() : async [ContentPackage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view content packages");
    };
    contentPackages.values().toArray();
  };

  public query ({ caller }) func getExternalContentPackages() : async [ContentPackage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view external content packages");
    };
    externalContentPackages.values().toArray();
  };

  public query ({ caller }) func getContentPackage(id : Nat) : async ?ContentPackage {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view content packages");
    };
    contentPackages.get(id);
  };

  public query ({ caller }) func getExternalContentPackage(id : Nat) : async ?ContentPackage {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view external content packages");
    };
    externalContentPackages.get(id);
  };

  public shared ({ caller }) func saveVideoAsset(id : Nat, video : VideoAsset) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save video assets");
    };
    switch (contentPackages.get(id)) {
      case (?contentPackage) {
        let updatedVideoAssets = List.fromArray<VideoAsset>(contentPackage.videoAssets);
        updatedVideoAssets.add(video);
        let updatedContentPackage = {
          contentPackage with
          videoAssets = updatedVideoAssets.toArray();
        };
        contentPackages.add(id, updatedContentPackage);
      };
      case (null) { Runtime.trap("Content package not found") };
    };
  };

  public shared ({ caller }) func saveExternalVideoAsset(id : Nat, video : VideoAsset) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save external video assets");
    };
    switch (externalContentPackages.get(id)) {
      case (?contentPackage) {
        let updatedVideoAssets = List.fromArray<VideoAsset>(contentPackage.videoAssets);
        updatedVideoAssets.add(video);
        let updatedContentPackage = {
          contentPackage with
          videoAssets = updatedVideoAssets.toArray();
        };
        externalContentPackages.add(id, updatedContentPackage);
      };
      case (null) { Runtime.trap("External content package not found") };
    };
  };

  // Lead Management - createLead is public for landing page submissions
  public shared ({ caller }) func createLead(lead : Lead) : async () {
    // No authorization check - public endpoint for landing page lead capture
    leads.add(lead.id, lead);
    nextLeadId += 1;
  };

  public query ({ caller }) func getLeads() : async [Lead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view leads");
    };
    leads.values().toArray();
  };

  public shared ({ caller }) func updateLeadStatus(id : Nat, status : LeadStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update lead status");
    };
    switch (leads.get(id)) {
      case (?lead) {
        let updatedLead = {
          lead with
          status = status;
        };
        leads.add(id, updatedLead);
      };
      case (null) { Runtime.trap("Lead not found") };
    };
  };

  public shared ({ caller }) func addLeadNote(id : Nat, note : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add lead notes");
    };
    switch (leads.get(id)) {
      case (?lead) {
        let updatedNotes = List.fromArray(lead.notes);
        updatedNotes.add(note);
        let updatedLead = {
          lead with
          notes = updatedNotes.toArray();
        };
        leads.add(id, updatedLead);
      };
      case (null) { Runtime.trap("Lead not found") };
    };
  };

  public query ({ caller }) func getContentPackageCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view content package count");
    };
    contentPackages.size();
  };

  public query ({ caller }) func getLeadCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view lead count");
    };
    leads.size();
  };

  public query ({ caller }) func getAllLeads() : async [Lead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view leads");
    };
    leads.values().toArray();
  };

  public shared ({ caller }) func addHashtagsToContentPackage(id : Nat, hashtags : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add hashtags to content packages");
    };
    switch (contentPackages.get(id)) {
      case (?contentPackage) {
        let updatedContentPackage = {
          contentPackage with
          hashtags;
        };
        contentPackages.add(id, updatedContentPackage);
      };
      case (null) { Runtime.trap("Content package not found") };
    };
  };

  public shared ({ caller }) func removeVideoAsset(contentPackageId : Nat, videoId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove video assets");
    };
    switch (contentPackages.get(contentPackageId)) {
      case (?contentPackage) {
        let filteredVideos = List.fromArray<VideoAsset>(contentPackage.videoAssets);
        let updatedVideos = filteredVideos.toArray();
        if (updatedVideos.size() == contentPackage.videoAssets.size()) {
          Runtime.trap("No video found with the given ID");
        } else {
          let updatedContentPackage = {
            contentPackage with
            videoAssets = updatedVideos;
          };
          contentPackages.add(contentPackageId, updatedContentPackage);
        };
      };
      case (null) { Runtime.trap("Content package not found") };
    };
  };

  public query ({ caller }) func getAllContentPackageIds() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view content package IDs");
    };
    let contentPackageIds = List.empty<Nat>();
    for ((id, _) in contentPackages.entries()) {
      contentPackageIds.add(id);
    };
    contentPackageIds.toArray();
  };

  public shared ({ caller }) func updateVideoAssetStatus(contentPackageId : Nat, videoId : Nat, newStatus : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update video asset status");
    };
    switch (contentPackages.get(contentPackageId)) {
      case (?contentPackage) {
        let videoIndex = contentPackage.videoAssets.findIndex(func(asset) { asset.id == videoId });
        switch (videoIndex) {
          case (?index) {
            let updatedVideo = { contentPackage.videoAssets[index] with status = newStatus };
            let newVideoAssets = Array.tabulate(
              contentPackage.videoAssets.size(),
              func(i) {
                if (i == index) { updatedVideo } else { contentPackage.videoAssets[i] };
              },
            );
            let updatedContentPackage = {
              contentPackage with
              videoAssets = newVideoAssets;
            };
            contentPackages.add(contentPackageId, updatedContentPackage);
          };
          case (null) { Runtime.trap("Video asset not found") };
        };
      };
      case (null) { Runtime.trap("Content package not found") };
    };
  };

  public query ({ caller }) func getContentPackagesByCreator(_creator : Text) : async [ContentPackage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view content packages by creator");
    };
    let contentPackageList = List.empty<ContentPackage>();
    for ((_, contentPackage) in contentPackages.entries()) {
      contentPackageList.add(contentPackage);
    };
    contentPackageList.toArray().sort();
  };
};
