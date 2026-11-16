import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import userRepository from "../src/repositories/user.repository.js";
import userLibraryService from "../src/services/user-library.service.js";
import { closePool } from "../src/config/db.js";

test.after(async () => {
  await closePool();
});

test("User Library - Personal Features and Collections", async (t) => {
  // Create test user directly
  const email = `lib_user_${Date.now()}_${crypto.randomInt(1000, 9999)}@example.com`;
  const user = await userRepository.createUser({
    name: "Satsangi Singh",
    email,
    passwordHash: "dummyHash123",
    isVerified: true
  });
  await userRepository.createProfile(user.id, { displayName: "Satsangi" });

  await t.test("1. Profile retrieval and update", async () => {
    const profile = await userLibraryService.getProfile(user.id);
    assert.equal(profile.email, email);
    assert.equal(profile.display_name, "Satsangi");

    const updated = await userLibraryService.updateProfile(user.id, {
      bio: "Student of Gurmat",
      avatarUrl: "https://example.com/avatar.png"
    });
    assert.equal(updated.bio, "Student of Gurmat");
    assert.equal(updated.avatar_url, "https://example.com/avatar.png");
  });

  let bookmarkId = null;

  await t.test("2. Bookmarks creation, retrieval and deletion", async () => {
    const bm = await userLibraryService.createBookmark(user.id, {
      type: "ang",
      source: "G",
      pageNumber: 1,
      title: "Japji Sahib Opening",
      note: "Mool Mantar"
    });
    assert.ok(bm.id);
    assert.equal(bm.page_number, 1);
    bookmarkId = bm.id;

    const list = await userLibraryService.getBookmarks(user.id);
    assert.ok(list.length >= 1);

    const deleted = await userLibraryService.deleteBookmark(bookmarkId, user.id);
    assert.equal(deleted.id, bookmarkId);
  });

  let collectionId = null;
  let itemId = null;

  await t.test("3. Personal Collections and items management", async () => {
    const col = await userLibraryService.createCollection(user.id, {
      title: "Morning Simran",
      description: "Shabads for Amritvela"
    });
    assert.ok(col.id);
    assert.equal(col.title, "Morning Simran");
    collectionId = col.id;

    const item = await userLibraryService.addItemToCollection(collectionId, user.id, {
      shabadId: 12,
      source: "G",
      note: "Very soothing"
    });
    assert.ok(item.id);
    itemId = item.id;

    const colWithItems = await userLibraryService.getCollectionById(collectionId, user.id);
    assert.equal(colWithItems.items.length, 1);
    assert.equal(colWithItems.items[0].shabad_id, 12);

    await userLibraryService.removeItemFromCollection(itemId, collectionId, user.id);
    const colAfterRemoval = await userLibraryService.getCollectionById(collectionId, user.id);
    assert.equal(colAfterRemoval.items.length, 0);

    await userLibraryService.deleteCollection(collectionId, user.id);
  });

  let noteId = null;

  await t.test("4. Personal Notes management", async () => {
    const note = await userLibraryService.createNote(user.id, {
      shabadId: 100,
      source: "G",
      content: "Deep contemplation on this verse"
    });
    assert.ok(note.id);
    noteId = note.id;

    const retrieved = await userLibraryService.getNoteById(noteId, user.id);
    assert.equal(retrieved.content, "Deep contemplation on this verse");

    const updated = await userLibraryService.updateNote(noteId, user.id, {
      content: "Updated contemplation"
    });
    assert.equal(updated.content, "Updated contemplation");

    await userLibraryService.deleteNote(noteId, user.id);
  });

  await t.test("5. Reading Progress and History", async () => {
    const prog = await userLibraryService.updateProgress(user.id, {
      source: "G",
      currentPage: 50,
      totalPages: 1430,
      completedCycles: 1
    });
    assert.equal(prog.current_page, 50);
    assert.equal(prog.completed_cycles, 1);

    const fetchedProg = await userLibraryService.getProgress(user.id, "G");
    assert.equal(fetchedProg.current_page, 50);

    // Add reading history
    await userLibraryService.updateProgress(user.id, {
      source: "G",
      currentPage: 51
    });
  });

  await t.test("6. User Preferences", async () => {
    const prefs = await userLibraryService.updatePreferences(user.id, {
      theme: "dark",
      fontSize: "large",
      larivaar: true,
      englishTranslation: true,
      punjabiTeeka: true
    });
    assert.equal(prefs.theme, "dark");
    assert.equal(prefs.larivaar, true);

    const retrievedPrefs = await userLibraryService.getPreferences(user.id);
    assert.equal(retrievedPrefs.theme, "dark");
    assert.equal(retrievedPrefs.font_size, "large");
  });
});
