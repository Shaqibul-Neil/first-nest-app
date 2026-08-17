# Interview Notes — NestJS + Mongoose

Nijer project theke shekha jinis gulo, interview-ready form e.
Topics: Mongoose `.lean()` / hydration, DTO vs Schema, `HydratedDocument`, Nest DI scope.

---

## Q1: "What does `.lean()` do in Mongoose?"

### 30-second answer

> By default Mongoose *hydrates* every query result — it wraps the raw BSON in a Mongoose Document, which adds getters/setters, change tracking, virtuals, validation and methods like `save()`. `.lean()` skips that step and returns plain JavaScript objects instead.
>
> The trade-off is capability for performance. A lean result has no `save()`, no virtuals, no change tracking — but it's significantly faster and uses much less memory, because you're not constructing a Document per row.
>
> So I use `.lean()` for read-only paths — list endpoints, search results, anything I'm serializing straight to JSON. I keep hydration when I need to mutate and persist the document.

### Follow-up: "How much faster?"

> Depends on result size, since the cost is per-document. For a single record it's negligible; for a few thousand rows it's typically several times faster and a large memory reduction. The rule I apply is: the bigger the result set, the more `.lean()` matters.

⚠️ Specific number bolo na ("3x faster") unless nijer benchmark kora ache — interviewer ekhane honesty dekhe.

### Follow-up: "What exactly do you lose?"

> `save()`, `deleteOne()` and other document methods; virtuals; getters and setters; change tracking; and default `toJSON`/`toObject` transforms. Validation on write doesn't apply either, since you can't write it back directly.

### Follow-up: "How would you prove a document is hydrated?"

Ei answer ta tomake alada kore dibe — bhitorer mechanism jano seta dekhay:

> A hydrated document doesn't store your fields on itself. `Object.keys()` on it returns `['$__', '_doc']` — your actual data lives in `_doc`, and `$__` holds Mongoose's internal state. Field access works through prototype getters that read from `_doc` and mark paths dirty on write — that's what lets `save()` send only the changed fields. A lean object has your real keys directly: `['_id', 'name', 'address', '__v']`.

Verified locally:

| | hydrated | `.lean()` |
|---|---|---|
| `constructor.name` | `"model"` | `"Object"` |
| `'save' in obj` | `true` | `false` |
| `obj instanceof Model` | `true` | `false` |
| `Object.keys(obj)` | `["$__", "_doc"]` | `["_id", "name", "address", "__v"]` |

### Follow-up: "Any gotchas?"

> Two. First, `_id` is still an `ObjectId`, not a string — comparing it to a string fails silently, so `.toString()` first. Second, if the codebase relies on virtuals or a custom `toJSON`, adding `.lean()` silently drops them from the response — it's a behavior change, not just an optimization.

### Kobe kon ta

| Situation | Use |
|---|---|
| GET / list / search / read-only | `.lean()` |
| PUT / PATCH / DELETE, `save()` lagbe | hydrated (default) |
| virtuals ba schema methods lagbe | hydrated |

---

## Q2: "Why not use your Mongoose schema class as the request DTO?"

> Three reasons. Separation of concerns — the API contract and the database shape change for different reasons and shouldn't be coupled. Security — binding the request body straight to the persistence model invites mass-assignment. And practically, it breaks: NestJS's `ValidationPipe` calls `plainToInstance` on the target type, which does `new User()`. If that class extends Mongoose's `Document`, the constructor tries to read `schema.tree` on a schema that was never injected, and you get `Cannot read properties of undefined (reading 'tree')`. Mongoose documents are meant to be constructed by the Model, not by a transformer.

Eta amader nijer debug kora bug — real experience hishebe bola jay, strong signal.

---

## Q3: "Why `HydratedDocument<User>` instead of `class User extends Document`?"

> `extends Document` conflates two things: the data shape and the runtime document. It makes the class unsafe to instantiate outside Mongoose, and it leaks document internals into every place that just needs the field shape. `HydratedDocument<User>` is a type-only alias — zero runtime footprint — so `User` stays a plain class for the schema and the model token, while `UserDocument` describes what queries actually return. NestJS's docs recommend this now; `extends Document` is the legacy pattern.

| | `User` | `UserDocument` |
|---|---|---|
| Ki ache | `name`, `address` | `User` + `_id`, `__v`, `save()`, ... |
| Runtime e ache? | ✅ class | ❌ type only |
| Kothay use | schema, `@InjectModel(User.name)` | query return type, `Model<>` |

---

## Q4: "`@ValidateNested()` ba `@Type()` — ekta bad dile ki hoy?"

> Nested validation silently stops working. `@ValidateNested()` tells class-validator to recurse, but at runtime it has no way to know which class the nested plain object maps to — TypeScript types are erased. `@Type(() => AddressDto)` is what class-transformer uses to instantiate the nested class first. Without it, the nested object passes unchecked. It fails open, not closed, which is why it's a common security bug.

"Fails open" phrase ta bolo — interviewer ra ei kotha te react kore.

### Related: `ValidationPipe` options

```ts
new ValidationPipe({
  whitelist: true,            // decorator nai emon field strip kore
  forbidNonWhitelisted: true, // extra field pathale 400 throw kore
})
```

⚠️ `whitelist: true` er karone DTO er protita field e kompokkhe ekta validator decorator **lagbei** — na hole field ta silently uro jabe, kono error chara.

---

## Q5: "`Nest can't resolve dependencies` — how do you debug it?"

> The error message names the controller, the missing token, and critically **which module** it was being built in. Almost always the answer is a scope mismatch: the class is registered in a module that doesn't have the provider. In my case the controller was declared in two modules — the feature module that owned the service, and `AppModule`, which didn't. Nest builds a separate instance per module, so the `AppModule` copy had nothing to inject. A controller or provider should be declared in exactly one module; you share it by importing that module, not by re-declaring the class.

**Rule:** ekta controller/provider **ekta** module e declare hobe. Share korte hole oi module ta `imports` e dao — class ta abar `controllers`/`providers` e likho na.

---

## Bonus: "How would you optimize a read-heavy API?"

`.lean()` shudhu ekta point. Puro list bolte parle senior level shonabe:

> `.lean()` to skip hydration; `.select()` to fetch only needed fields; proper indexes on the query and sort paths; pagination instead of unbounded `find()`; and `.explain()` to confirm the query actually uses an index rather than doing a collection scan.

---

## Quick recall — ek nojore

| Concept | Ek line e |
|---|---|
| Hydration | raw BSON → Mongoose Document (getters, tracking, `save()`) |
| `.lean()` | hydration skip, plain JS object, faster + lighter, read-only |
| DTO | incoming request er shape + validation. Plain class, no DB. |
| Schema | database e ki structure e save hobe |
| `HydratedDocument<T>` | `T` er field + Mongoose document powers. Type only. |
| `@Type()` + `@ValidateNested()` | duitai ekshathe lage, na hole nested validation fails **open** |
| DI scope error | class duita module e declare — ekta rakho, module import koro |
