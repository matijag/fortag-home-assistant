/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis, V = T.ShadowRoot && (T.ShadyCSS === void 0 || T.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), G = /* @__PURE__ */ new WeakMap();
let pt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== K) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (V && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = G.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && G.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const $t = (n) => new pt(typeof n == "string" ? n : n + "", void 0, K), mt = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((s, r, o) => s + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + n[o + 1], n[0]);
  return new pt(e, n, K);
}, vt = (n, t) => {
  if (V) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = T.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, n.appendChild(s);
  }
}, Q = V ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return $t(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: yt, defineProperty: bt, getOwnPropertyDescriptor: At, getOwnPropertyNames: wt, getOwnPropertySymbols: xt, getPrototypeOf: St } = Object, v = globalThis, X = v.trustedTypes, Et = X ? X.emptyScript : "", L = v.reactiveElementPolyfillSupport, P = (n, t) => n, I = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? Et : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, Y = (n, t) => !yt(n, t), tt = { attribute: !0, type: String, converter: I, reflect: !1, useDefault: !1, hasChanged: Y };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), v.litPropertyMetadata ?? (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let S = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = tt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && bt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: o } = At(this.prototype, t) ?? { get() {
      return this[e];
    }, set(i) {
      this[e] = i;
    } };
    return { get: r, set(i) {
      const a = r == null ? void 0 : r.call(this);
      o == null || o.call(this, i), this.requestUpdate(t, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = St(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const e = this.properties, s = [...wt(e), ...xt(e)];
      for (const r of s) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, r] of e) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const r = this._$Eu(e, s);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) e.unshift(Q(r));
    } else t !== void 0 && e.push(Q(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return vt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var o;
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const i = (((o = s.converter) == null ? void 0 : o.toAttribute) !== void 0 ? s.converter : I).toAttribute(e, s.type);
      this._$Em = t, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, i;
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const a = s.getPropertyOptions(r), c = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((o = a.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? a.converter : I;
      this._$Em = r;
      const d = c.fromAttribute(e, a.type);
      this[r] = d ?? ((i = this._$Ej) == null ? void 0 : i.get(r)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, o) {
    var i;
    if (t !== void 0) {
      const a = this.constructor;
      if (r === !1 && (o = this[t]), s ?? (s = a.getPropertyOptions(t)), !((s.hasChanged ?? Y)(o, e) || s.useDefault && s.reflect && o === ((i = this._$Ej) == null ? void 0 : i.get(t)) && !this.hasAttribute(a._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: r, wrapped: o }, i) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, i ?? e ?? this[t]), o !== !0 || i !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, i] of this._$Ep) this[o] = i;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [o, i] of r) {
        const { wrapped: a } = i, c = this[o];
        a !== !0 || this._$AL.has(o) || c === void 0 || this.C(o, void 0, i, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((r) => {
        var o;
        return (o = r.hostUpdate) == null ? void 0 : o.call(r);
      }), this.update(e)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var r;
      return (r = s.hostUpdated) == null ? void 0 : r.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[P("elementProperties")] = /* @__PURE__ */ new Map(), S[P("finalized")] = /* @__PURE__ */ new Map(), L == null || L({ ReactiveElement: S }), (v.reactiveElementVersions ?? (v.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = globalThis, et = (n) => n, z = O.trustedTypes, st = z ? z.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, ut = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, gt = "?" + m, kt = `<${gt}>`, x = document, U = () => x.createComment(""), N = (n) => n === null || typeof n != "object" && typeof n != "function", Z = Array.isArray, Ct = (n) => Z(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", W = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rt = /-->/g, it = />/g, b = RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ot = /'/g, nt = /"/g, _t = /^(?:script|style|textarea|title)$/i, Pt = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), g = Pt(1), E = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), at = /* @__PURE__ */ new WeakMap(), A = x.createTreeWalker(x, 129);
function ft(n, t) {
  if (!Z(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return st !== void 0 ? st.createHTML(t) : t;
}
const Ot = (n, t) => {
  const e = n.length - 1, s = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", i = C;
  for (let a = 0; a < e; a++) {
    const c = n[a];
    let d, l, h = -1, f = 0;
    for (; f < c.length && (i.lastIndex = f, l = i.exec(c), l !== null); ) f = i.lastIndex, i === C ? l[1] === "!--" ? i = rt : l[1] !== void 0 ? i = it : l[2] !== void 0 ? (_t.test(l[2]) && (r = RegExp("</" + l[2], "g")), i = b) : l[3] !== void 0 && (i = b) : i === b ? l[0] === ">" ? (i = r ?? C, h = -1) : l[1] === void 0 ? h = -2 : (h = i.lastIndex - l[2].length, d = l[1], i = l[3] === void 0 ? b : l[3] === '"' ? nt : ot) : i === nt || i === ot ? i = b : i === rt || i === it ? i = C : (i = b, r = void 0);
    const $ = i === b && n[a + 1].startsWith("/>") ? " " : "";
    o += i === C ? c + kt : h >= 0 ? (s.push(d), c.slice(0, h) + ut + c.slice(h) + m + $) : c + m + (h === -2 ? a : $);
  }
  return [ft(n, o + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class R {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let o = 0, i = 0;
    const a = t.length - 1, c = this.parts, [d, l] = Ot(t, e);
    if (this.el = R.createElement(d, s), A.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = A.nextNode()) !== null && c.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(ut)) {
          const f = l[i++], $ = r.getAttribute(h).split(m), D = /([.?@])?(.*)/.exec(f);
          c.push({ type: 1, index: o, name: D[2], strings: $, ctor: D[1] === "." ? Ut : D[1] === "?" ? Nt : D[1] === "@" ? Rt : B }), r.removeAttribute(h);
        } else h.startsWith(m) && (c.push({ type: 6, index: o }), r.removeAttribute(h));
        if (_t.test(r.tagName)) {
          const h = r.textContent.split(m), f = h.length - 1;
          if (f > 0) {
            r.textContent = z ? z.emptyScript : "";
            for (let $ = 0; $ < f; $++) r.append(h[$], U()), A.nextNode(), c.push({ type: 2, index: ++o });
            r.append(h[f], U());
          }
        }
      } else if (r.nodeType === 8) if (r.data === gt) c.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(m, h + 1)) !== -1; ) c.push({ type: 7, index: o }), h += m.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = x.createElement("template");
    return s.innerHTML = t, s;
  }
}
function k(n, t, e = n, s) {
  var i, a;
  if (t === E) return t;
  let r = s !== void 0 ? (i = e._$Co) == null ? void 0 : i[s] : e._$Cl;
  const o = N(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== o && ((a = r == null ? void 0 : r._$AO) == null || a.call(r, !1), o === void 0 ? r = void 0 : (r = new o(n), r._$AT(n, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = r : e._$Cl = r), r !== void 0 && (t = k(n, r._$AS(n, t.values), r, s)), t;
}
class Ht {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? x).importNode(e, !0);
    A.currentNode = r;
    let o = A.nextNode(), i = 0, a = 0, c = s[0];
    for (; c !== void 0; ) {
      if (i === c.index) {
        let d;
        c.type === 2 ? d = new M(o, o.nextSibling, this, t) : c.type === 1 ? d = new c.ctor(o, c.name, c.strings, this, t) : c.type === 6 && (d = new Mt(o, this, t)), this._$AV.push(d), c = s[++a];
      }
      i !== (c == null ? void 0 : c.index) && (o = A.nextNode(), i++);
    }
    return A.currentNode = x, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class M {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = k(this, t, e), N(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ct(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && N(this._$AH) ? this._$AA.nextSibling.data = t : this.T(x.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = R.createElement(ft(s.h, s.h[0]), this.options)), s);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === r) this._$AH.p(e);
    else {
      const i = new Ht(r, this), a = i.u(this.options);
      i.p(e), this.T(a), this._$AH = i;
    }
  }
  _$AC(t) {
    let e = at.get(t.strings);
    return e === void 0 && at.set(t.strings, e = new R(t)), e;
  }
  k(t) {
    Z(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const o of t) r === e.length ? e.push(s = new M(this.O(U()), this.O(U()), this, this.options)) : s = e[r], s._$AI(o), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = et(t).nextSibling;
      et(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, r, o) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(t, e = this, s, r) {
    const o = this.strings;
    let i = !1;
    if (o === void 0) t = k(this, t, e, 0), i = !N(t) || t !== this._$AH && t !== E, i && (this._$AH = t);
    else {
      const a = t;
      let c, d;
      for (t = o[0], c = 0; c < o.length - 1; c++) d = k(this, a[s + c], e, c), d === E && (d = this._$AH[c]), i || (i = !N(d) || d !== this._$AH[c]), d === p ? t = p : t !== p && (t += (d ?? "") + o[c + 1]), this._$AH[c] = d;
    }
    i && !r && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ut extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Nt extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class Rt extends B {
  constructor(t, e, s, r, o) {
    super(t, e, s, r, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = k(this, t, e, 0) ?? p) === E) return;
    const s = this._$AH, r = t === p && s !== p || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== p && (s === p || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Mt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    k(this, t);
  }
}
const q = O.litHtmlPolyfillSupport;
q == null || q(R, M), (O.litHtmlVersions ?? (O.litHtmlVersions = [])).push("3.3.3");
const Dt = (n, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = r = new M(t.insertBefore(U(), o), o, void 0, e ?? {});
  }
  return r._$AI(n), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w = globalThis;
class H extends S {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Dt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return E;
  }
}
var ht;
H._$litElement$ = !0, H.finalized = !0, (ht = w.litElementHydrateSupport) == null || ht.call(w, { LitElement: H });
const F = w.litElementPolyfillSupport;
F == null || F({ LitElement: H });
(w.litElementVersions ?? (w.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Tt = { attribute: !0, type: String, converter: I, reflect: !1, hasChanged: Y }, It = (n = Tt, t, e) => {
  const { kind: s, metadata: r } = e;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), s === "setter" && ((n = Object.create(n)).wrapped = !0), o.set(e.name, n), s === "accessor") {
    const { name: i } = e;
    return { set(a) {
      const c = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(i, c, n, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(i, void 0, n, a), a;
    } };
  }
  if (s === "setter") {
    const { name: i } = e;
    return function(a) {
      const c = this[i];
      t.call(this, a), this.requestUpdate(i, c, n, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function j(n) {
  return (t, e) => typeof e == "object" ? It(n, t, e) : ((s, r, o) => {
    const i = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, s), i ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(n, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function y(n) {
  return j({ ...n, state: !0, attribute: !1 });
}
var zt = Object.defineProperty, _ = (n, t, e, s) => {
  for (var r = void 0, o = n.length - 1, i; o >= 0; o--)
    (i = n[o]) && (r = i(t, e, r) || r);
  return r && zt(t, e, r), r;
};
const ct = "fortag.sortField", lt = "fortag.sortDirection", dt = "fortag.currentHostsOnly", J = class J extends H {
  constructor() {
    super(...arguments), this.narrow = !1, this._scanData = null, this._progress = { status: "idle", target: "" }, this._scanning = !1, this._expandedMAC = null, this._editingRange = !1, this._sortBy = "ip", this._sortDirection = "asc", this._currentHostsOnly = !0;
  }
  async connectedCallback() {
    super.connectedCallback(), this._loadPreferences(), this._fetchData(), setInterval(() => this._fetchData(), 1e4);
  }
  _loadPreferences() {
    try {
      const t = localStorage.getItem(ct);
      (t === "name" || t === "ip" || t === "first_seen" || t === "last_seen") && (this._sortBy = t);
      const e = localStorage.getItem(lt);
      (e === "asc" || e === "desc") && (this._sortDirection = e);
      const s = localStorage.getItem(dt);
      s !== null && (this._currentHostsOnly = s === "true");
    } catch (t) {
      console.warn("Could not load Fortag panel preferences", t);
    }
  }
  _savePreference(t, e) {
    try {
      localStorage.setItem(t, e);
    } catch (s) {
      console.warn("Could not save Fortag panel preference", s);
    }
  }
  async _fetchData() {
    try {
      const t = await this.hass.callWS({ type: "fortag_scanner/get_state" });
      t && (this._scanData = t.state, this._progress = t.progress, this._scanning = this._progress.status !== "idle");
    } catch (t) {
      console.error("Failed to fetch scan data", t);
    }
  }
  async _triggerScan() {
    this._scanning = !0;
    try {
      await this.hass.callWS({ type: "fortag_scanner/scan_now" }), this.dispatchEvent(new CustomEvent("hass-notification", {
        detail: { message: "Network scan triggered successfully" },
        bubbles: !0,
        composed: !0
      }));
    } catch (t) {
      console.error("Failed to trigger scan", t);
    }
  }
  async _updateRange() {
    var s;
    const t = (s = this.shadowRoot) == null ? void 0 : s.querySelector(".range-input"), e = t == null ? void 0 : t.value;
    if (e)
      try {
        await this.hass.callWS({
          type: "fortag_scanner/set_range",
          range: e
        }), this._editingRange = !1, this._fetchData();
      } catch {
        alert("Invalid range or communication error");
      }
  }
  _toggleExpand(t) {
    this._expandedMAC = this._expandedMAC === t ? null : t;
  }
  async _renameHost(t, e) {
    const s = prompt("Enter a new name for this device:", e || "");
    if (!(s === null || s === e))
      try {
        await this.hass.callWS({
          type: "fortag_scanner/rename",
          mac: t,
          name: s
        }), this._scanData && this._scanData.hosts && (this._scanData.hosts = this._scanData.hosts.map((r) => r.mac === t ? { ...r, custom_name: s, is_acknowledged: !0 } : r), this.requestUpdate());
      } catch (r) {
        console.error("Failed to rename host", r);
      }
  }
  async _acknowledge(t, e, s) {
    try {
      await this.hass.callWS({
        type: "fortag_scanner/acknowledge",
        mac: t,
        port: e,
        protocol: s
      }), this._scanData && this._scanData.hosts && (this._scanData.hosts = this._scanData.hosts.map((r) => r.mac === t ? e ? { ...r, ports: r.ports.map((o) => o.port === e && o.protocol === s ? { ...o, is_acknowledged: !0 } : o) } : { ...r, is_acknowledged: !0 } : r), this.requestUpdate());
    } catch (r) {
      console.error("Failed to acknowledge", r);
    }
  }
  _handleSortChange(t) {
    const e = t.target;
    this._sortBy = e.value, this._savePreference(ct, this._sortBy);
  }
  _toggleSortDirection() {
    this._sortDirection = this._sortDirection === "asc" ? "desc" : "asc", this._savePreference(lt, this._sortDirection);
  }
  _toggleCurrentHosts() {
    this._currentHostsOnly = !this._currentHostsOnly, this._savePreference(dt, String(this._currentHostsOnly));
  }
  _compareIPs(t, e) {
    const s = t.split(".").map(Number), r = e.split(".").map(Number);
    for (let o = 0; o < 4; o++) {
      const i = (s[o] || 0) - (r[o] || 0);
      if (i !== 0) return i;
    }
    return 0;
  }
  _sortHosts(t) {
    const e = this._sortDirection === "asc" ? 1 : -1;
    return [...t].sort((s, r) => {
      let o = "", i = "", a = 0;
      return this._sortBy === "name" ? (o = s.custom_name || s.hostname || "Unknown", i = r.custom_name || r.hostname || "Unknown", a = o.localeCompare(i, void 0, { sensitivity: "base", numeric: !0 })) : this._sortBy === "ip" ? (o = s.ip || "", i = r.ip || "", a = this._compareIPs(o, i)) : this._sortBy === "first_seen" ? (o = s.created_at || "", i = r.created_at || "", a = o.localeCompare(i)) : (o = s.last_seen || "", i = r.last_seen || "", a = o.localeCompare(i)), !o && i ? 1 : o && !i ? -1 : a !== 0 ? a * e : this._compareIPs(s.ip || "", r.ip || "");
    });
  }
  render() {
    const t = this._scanData, e = this._progress, s = (t == null ? void 0 : t.hosts) || [], r = this._currentHostsOnly ? s.filter((i) => i.is_current !== !1) : s, o = this._sortHosts(r);
    return g`
      <div class="header">
        <h1>Network Security Scanner</h1>
        <div class="range-config">
            <span>Target:</span>
            <input class="range-input" .value="${(t == null ? void 0 : t.scan_range) || ""}" ?disabled="${!this._editingRange}">
            ${this._editingRange ? g`
                <button class="action-btn" @click="${this._updateRange}">Save</button>
                <button class="action-btn" @click="${() => this._editingRange = !1}">Cancel</button>
            ` : g`
                <button class="action-btn" @click="${() => this._editingRange = !0}">Edit</button>
            `}
        </div>
        <button 
          class="main-button"
          @click="${this._triggerScan}" 
          .disabled="${this._scanning}">
          ${this._scanning ? "Scanning..." : "Scan Now"}
        </button>
      </div>

      ${this._scanning ? g`
        <div class="progress-banner">
            <ha-circular-progress active size="small"></ha-circular-progress>
            <span>
                ${e.status === "scanning_hosts" ? `Discovering active hosts in ${e.target}...` : ""}
                ${e.status === "scanning_ports" ? `Analyzing open ports and OS for ${e.target}...` : ""}
            </span>
        </div>
      ` : ""}

      <div class="stats">
        <div class="stat-card">
          <div class="label">Last Full Scan</div>
          <div class="value">${(t == null ? void 0 : t.last_scan) || "Never"}</div>
        </div>
        <div class="stat-card">
          <div class="label">Duration</div>
          <div class="value">${(t == null ? void 0 : t.duration) || "N/A"}</div>
        </div>
        <div class="stat-card">
          <div class="label">Scanner</div>
          <div class="value">${(t == null ? void 0 : t.scanner_version) || "Unknown"} · MQTT API v${(t == null ? void 0 : t.api_version) ?? "?"}</div>
        </div>
      </div>

      <div class="controls-bar">
          <button
            class="action-btn host-scope"
            @click="${this._toggleCurrentHosts}"
            title="Switch between hosts identified in the latest scan and all known hosts"
            aria-pressed="${this._currentHostsOnly}">
            ${this._currentHostsOnly ? `Current hosts (${o.length})` : `All known hosts (${o.length})`}
          </button>
          <span>Sort by:</span>
          <select class="sort-select" .value="${this._sortBy}" @change="${this._handleSortChange}" aria-label="Sort hosts by">
              <option value="name">Name</option>
              <option value="ip">IP Address</option>
              <option value="first_seen">First Detected</option>
              <option value="last_seen">Last Detected</option>
          </select>
          <button
            class="action-btn sort-direction"
            @click="${this._toggleSortDirection}"
            title="Reverse sort direction"
            aria-label="Sort ${this._sortDirection === "asc" ? "ascending" : "descending"}; click to reverse">
            ${this._sortDirection === "asc" ? "Ascending ↑" : "Descending ↓"}
          </button>
      </div>

      <table class="host-table">
        <thead>
          <tr>
            <th>IP Address</th>
            <th>MAC Address</th>
            <th>Name / Hostname</th>
            <th>OS Guess</th>
            <th>Open Ports</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${o.map((i) => {
      var a, c, d;
      return g`
            <tr>
              <td>${i.ip}</td>
              <td><code>${i.mac}</code></td>
              <td>
                <div style="display: flex; flex-direction: column;">
                  <div>
                    ${!i.is_acknowledged && i.is_new_host ? g`
                        <span class="badge badge-new">NEW HOST</span>
                        <button class="ack-btn" @click="${() => this._acknowledge(i.mac)}">ACK</button>
                    ` : ""}
                    ${i.is_randomized ? g`<span class="badge badge-random">RANDOM MAC</span>` : ""}
                  </div>
                  <strong>${i.custom_name || i.hostname || "Unknown"}</strong>
                  <div style="font-size: 0.85em; color: var(--secondary-text-color); margin-top: 4px; line-height: 1.3;">
                    First seen: ${i.created_at || "N/A"}<br>
                    Last seen: ${i.last_seen || "N/A"}
                  </div>
                </div>
              </td>
              <td>${i.os || "Unknown"}</td>
              <td>
                ${(a = i.ports) == null ? void 0 : a.map((l) => g`
                  <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">
                    ${!l.is_acknowledged && l.is_new ? g`<span style="color: var(--error-color); font-weight: bold;">[NEW]</span>` : ""}
                    ${l.port}/${l.protocol} (${l.service})
                    ${!l.is_acknowledged && l.is_new ? g`
                        <button class="ack-btn" @click="${() => this._acknowledge(i.mac, l.port, l.protocol)}">ACK</button>
                    ` : ""}
                  </div>
                `)}
              </td>
              <td>
                <button class="action-btn" @click="${() => this._toggleExpand(i.mac)}">
                  ${this._expandedMAC === i.mac ? "Hide Details" : "Details"}
                </button>
                <button class="action-btn" @click="${() => this._renameHost(i.mac, i.custom_name || i.hostname)}">
                  Rename
                </button>
              </td>
            </tr>
            ${this._expandedMAC === i.mac ? g`
              <tr class="details-row">
                <td colspan="6">
                  <div class="details-container">
                    <strong>Extended Analysis for ${i.mac}:</strong>
                    <div class="details-content">
${(c = i.ports) == null ? void 0 : c.filter((l) => l.scripts).map((l) => g`
[Port ${l.port}/${l.protocol}]
${l.scripts}
`)}
${(d = i.ports) != null && d.some((l) => l.scripts) ? "" : "No extended script data available."}
                    </div>
                  </div>
                </td>
              </tr>
            ` : ""}
          `;
    })}
        </tbody>
      </table>
    `;
  }
};
J.styles = mt`
    :host {
      display: block;
      padding: 16px;
      background-color: var(--primary-background-color);
      color: var(--primary-text-color);
      font-family: var(--paper-font-body1_-_font-family);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--divider-color);
      padding-bottom: 16px;
    }
    .progress-banner {
        background: var(--primary-color);
        color: white;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: bold;
        animation: pulse 2s infinite;
    }
    @keyframes pulse {
        0% { opacity: 0.9; }
        50% { opacity: 1; }
        100% { opacity: 0.9; }
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: var(--card-background-color);
      padding: 16px;
      border-radius: 8px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0,0,0,0.14));
    }
    .range-config {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .range-input {
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color);
        padding: 4px 8px;
        border-radius: 4px;
    }
    .host-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--card-background-color);
      border-radius: 8px;
      overflow: hidden;
    }
    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid var(--divider-color);
    }
    th {
      background: var(--secondary-background-color);
      font-weight: bold;
    }
    .controls-bar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 16px;
      gap: 8px;
    }
    .sort-select {
      padding: 6px 12px;
      border-radius: 4px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 0.9em;
      outline: none;
      cursor: pointer;
    }
    .sort-direction {
      min-width: 9.5em;
    }
    .host-scope {
      min-width: 12em;
    }
    tr.details-row td {
      background: var(--secondary-background-color);
      padding: 0;
    }
    .details-container {
      padding: 16px;
      background: var(--primary-background-color);
      border: 1px solid var(--divider-color);
      margin: 8px;
      border-radius: 4px;
    }
    .details-content {
      font-family: 'Courier New', Courier, monospace;
      white-space: pre-wrap;
      font-size: 0.85em;
      line-height: 1.4;
      max-height: 400px;
      overflow-y: auto;
      padding: 10px;
      background: #000;
      color: #0f0;
      border-radius: 4px;
    }
    .badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.8em;
      font-weight: bold;
      margin-right: 4px;
    }
    .badge-new { background: var(--error-color); color: white; }
    .badge-random { background: var(--warning-color); color: black; }
    
    .action-btn {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.85em;
      margin-right: 4px;
    }
    .action-btn:hover {
      background: var(--primary-color);
      color: white;
    }
    .ack-btn {
      background: var(--warning-color);
      color: black;
      border: none;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.75em;
      cursor: pointer;
      font-weight: bold;
      margin-left: 4px;
    }

    .main-button {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    .main-button:hover { opacity: 0.9; }
    .main-button:disabled { background: var(--disabled-text-color); cursor: not-allowed; }
  `;
let u = J;
_([
  j({ type: Object })
], u.prototype, "hass");
_([
  j({ type: Boolean })
], u.prototype, "narrow");
_([
  j({ type: Object })
], u.prototype, "panel");
_([
  y()
], u.prototype, "_scanData");
_([
  y()
], u.prototype, "_progress");
_([
  y()
], u.prototype, "_scanning");
_([
  y()
], u.prototype, "_expandedMAC");
_([
  y()
], u.prototype, "_editingRange");
_([
  y()
], u.prototype, "_sortBy");
_([
  y()
], u.prototype, "_sortDirection");
_([
  y()
], u.prototype, "_currentHostsOnly");
customElements.get("fortag-scanner-panel") || customElements.define("fortag-scanner-panel", u);
export {
  u as FortagPanel
};
