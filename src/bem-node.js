;(function () {

/**
 * BEM-node class
 *
 * @nodeName string Starts with capital for block else for elem
 * @attr     object List of attributes
 * @children array  Child nodes
 */
function BemNode (nodeName, attr, children) {
    this._name = ''                 // BEM-name: 'block' or 'block__elem'
    this._nodeName = nodeName       // BML-node name
    this._attr = attr || {}         // BML-node attributes
    this._isBlock = false           // flag if node is block
    this._isElem = false            // flag if node is elem
    this._mod = {}                  // modifiers list
    this._modHandlers = {}          // handlers on modifiers change
    this._param = {}                // parameters list
    this._domNode = null            // DOM-node reference
    this._domAttr = {}              // DOM-attributes
    this._domClasses = null         // DOM-classes
    this._afterDomInitHandlers = [] // Handlers called after DOM-node inited
    this._domInited = false         // Flag if DOM-node inited
    this._parentBlock = null        // parent block bemNode reference
    this._forcedParentBlock = false // flag if parentBlock was set manualy with block param
    this._parentNode = null         // parent bemNode reference
    this._prevParentNode = null     // previous parent node value when parent node redefined
    this._children = []             // list of children
    this._expandedChildren = null   // list of expanded children (for expand method purposes)
    this._isExpanded = false        // if Bem-node was expanded
    this._isExpandContext = false   // when flag is true append modifies expandedChildren
    this._isReplaceContext = false  // when flag is true append don't renders children's DOM
    this._mix = []                  // list of additional CSS-classes
    this._tag = 'div'               // DOM-node name
    this._id = ''                   // Node identifier
    this._noElems = false           // Flag if block can have children
    this._implementedNode = null    // Node wich this node implements
    this._bemNodeIndex = -1         // index in Beast._bemNode array
    this._css = {}                  // css properties

    // Define if block or elem
    var firstLetter = nodeName.substr(0,1)
    this._isBlock = firstLetter === firstLetter.toUpperCase()
    this._isElem = !this._isBlock

    if (this._isBlock) {
        this._name = nodeName.toLowerCase()
        this._parentBlock = this
        this._defineUserMethods()
    }

    // Define mods, params and special params
    for (key in this._attr) {
        var firstLetter = key.substr(0,1)
        if (firstLetter === firstLetter.toUpperCase()) {
            this._mod[key.toLowerCase()] = this._attr[key]
        } else if (key === 'mix') {
            this._mix = this._attr.mix.split(' ')
        } else if (key === 'context' && !this._parentBlock) {
            this.parentBlock(this._attr.context)
        } else if (key === 'block') {
            this.parentBlock(this._attr.block, true)
            this._forcedParentBlock = true
        } else if (key === 'tag') {
            this._tag = this._attr.tag
        } else if (key === 'id') {
            this._id = this._attr.id
        } else {
            this._param[key] = this._attr[key]
        }
    }

    // Append children
    this.append.apply(this, children)
}

BemNode.prototype = {
    /*
     * PUBLIC
     */

    /**
     * If node is block
     *
     * @return boolean
     */
    isBlock: function () {
        return this._isBlock
    },

    /**
     * If node is element
     *
     * @return boolean
     */
    isElem: function () {
        return this._isElem
    },

    /**
     * Gets block or element name: 'block' or 'block__element'
     *
     * @return string
     */
    selector: function () {
        return this._name
    },

    /**
     * Gets or sets node's identifier
     *
     * @return string
     */
    id: function (id) {
        if (typeof id === 'undefined') {
            return this._id
        } else {
            this._id = id
            if (this._domNode) {
                this._domNode.id = id
            }
            return this
        }
    },

    /**
     * Gets or sets node's tag name
     *
     * @return string
     */
    tag: function (tag) {
        if (typeof tag === 'undefined') {
            return this._tag
        } else {
            if (!this._domNode) {
                this._tag = tag
            }
            return this
        }
    },

    /**
     * Sets css
     *
     * @name  string        css-property name
     * @value string|number css-property value
     */
    css: function (name, value) {
        if (typeof name === 'object') {
            for (key in name) this.css(key, name[key])
        } else if (typeof value === 'undefined') {
            if (this._domNode) {
                return window.getComputedStyle(this._domNode).getPropertyValue(name)
            } else {
                return this._css[name]
            }
        } else {
            if (typeof value === 'number' && cssPxProperty[name]) {
                value += 'px'
            }

            this._css[name] = value

            if (this._domNode) {
                this._setDomNodeCSS()
            }
        }

        return this
    },

    /**
     * Sets _noElems flag
     *
     * @value  boolean
     */
    noElems: function (value) {
        this._noElems = value
        this._setParentBlockForChildren(this, this._parentNode, true)
        return this
    },

    /**
     * Only for elements. Gets or sets parent block bemNode reference.
     * Also sets bemNode name adding 'blockName__' before element name.
     * [@bemNode, [@dontAffectChildren]]
     *
     * @bemNode            object  Parent block node
     * @dontAffectChildren boolean If true, children won't get this parent block reference
     */
    parentBlock: function (bemNode, dontAffectChildren) {
        if (bemNode) {
            if (this._isElem
                && bemNode instanceof BemNode
                && bemNode !== this._parentBlock
                && !this._forcedParentBlock) {

                if (bemNode._parentBlock._noElems) {
                    return this.parentBlock(bemNode._parentNode, dontAffectChildren)
                }

                this._clearUserMethods()
                this._parentBlock = bemNode._parentBlock
                this._name = this._parentBlock._name + '__' + this._nodeName
                this._defineUserMethods()

                if (!dontAffectChildren) {
                    this._setParentBlockForChildren(this, bemNode)
                }
            }
            return this
        } else {
            return this._implementedNode
                ? this._implementedNode._parentBlock
                : this._parentBlock
        }
    },

    /**
     * Gets or sets parent bemNode reference
     * [@bemNode]
     *
     * @bemNode object parent node
     */
    parentNode: function (bemNode) {
        if (bemNode) {
            if (bemNode instanceof BemNode) {
                this._prevParentNode = this._parentNode
                this._parentNode = bemNode
            }
            return this
        } else {
            return this._parentNode
        }
    },

    /**
     * Gets DOM-node reference
     */
    domNode: function () {
        return this._domNode
    },

    /**
     * Set or get dom attr
     * @name, [@value]
     *
     * @name  string Attribute name
     * @value string Attribute value
     */
    domAttr: function (name, value) {
        if (typeof name === 'object') {
            for (key in name) this.domAttr(key, name[key])
        } else if (typeof value === 'undefined') {
            return this._domAttr[name]
        } else {
            this._domAttr[name] = value
            if (this._domNode) {
                this._domNode.setAttribute(name, value)
            }
        }

        return this
    },

    /**
     * Set additional classes
     */
    mix: function () {
        for (var i = 0, ii = arguments.length; i < ii; i++) {
            this._mix.push(arguments[i])
        }
        if (this._domNode) {
            this._setDomNodeClasses()
        }

        return this
    },

    /**
     * Define modifiers and its default values
     */
    defineMod: function (defaults) {
        return this._extendProperty('_mod', defaults)
    },

    /**
     * Define parameters and its default values
     */
    defineParam: function (defaults) {
        return this._extendProperty('_param', defaults)
    },

    /**
     * Sets or gets mod.
     * @name, [@value, [@data]]
     *
     * @name  string         Modifier name
     * @value string|boolean Modifier value
     * @data  anything       Additional data
     */
    mod: function (name, value, data) {
        if (typeof name === 'object') {
            for (key in name) this.mod(key, name[key])
        } else if (typeof value === 'undefined') {
            return this._mod[name]
        } else if (this._mod[name] !== value) {
            this._mod[name] = value
            if (this._domNode) {
                this._setDomNodeClasses()
                this._callModHandlers(name, value, data)
            }
        }

        return this
    },

    /**
     * Sets or gets parameter.
     * @name, [@value]
     *
     * @name  string
     * @value anything
     */
    param: function (name, value) {
        if (typeof name === 'object') {
            for (key in name) this.param(key, name[key])
        } else if (typeof value === 'undefined') {
            return this._param[name]
        } else {
            this._param[name] = value
        }

        return this
    },

    /**
     * Sets events handler
     *
     * @events  string   Space splitted event list: 'click' or 'click keypress'
     * @handler function
     */
    on: function (events, handler) {
        var eventsArray = events.split(' ')
        for (var i = 0, ii = eventsArray.length; i < ii; i++) {
            (function (bemNode, event) {
                bemNode._domNode.addEventListener(event, function (e) {
                    handler.call(bemNode, e, e.detail)
                })
            })(this, eventsArray[i])
        }

        return this
    },

    /**
     * Sets modifier change handler
     *
     * @modName  string
     * @modValue string|boolean
     * @handler  function
     */
    onWin: function (events, handler) {
        var eventsArray = events.split(' ')
        for (var i = 0, ii = eventsArray.length; i < ii; i++) {
            (function (bemNode, event) {
                window.addEventListener(event, function (e) {
                    handler.call(bemNode, e, e.detail)
                })
            })(this, eventsArray[i])
        }

        return this
    },

    /**
     * Sets modifier change handler
     *
     * @modName  string
     * @modValue string|boolean
     * @handler  function
     */
    onMod: function (modName, modValue, handler) {
        if (typeof this._modHandlers[modName] === 'undefined') {
            this._modHandlers[modName] = {}
        }
        if (typeof this._modHandlers[modName][modValue] === 'undefined') {
            this._modHandlers[modName][modValue] = []
        }
        this._modHandlers[modName][modValue].push(handler)

        return this
    },

    /**
     * Triggers event
     *
     * @eventName string
     * @data      anything Additional data
     */
    trigger: function (eventName, data) {
        if (this._domNode) {
            this._domNode.dispatchEvent(
                data
                    ? new CustomEvent(eventName, {detail:data})
                    : new Event(eventName)
            )
        }

        return this
    },

    /**
     * Triggers window event
     *
     * @eventName string
     * @data      anything Additional data
     */
    triggerWin: function (eventName, data) {
        if (this._domNode) {
            eventName = (this._isBlock ? this._name : this._parentBlock._name) +':'+ eventName
            window.dispatchEvent(
                data
                    ? new CustomEvent(eventName, {detail:data})
                    : new Event(eventName)
            )
        }

        return this
    },

    /**
     * Gets current node index among siblings
     *
     * @return number
     */
    index: function () {
        var siblings = this._parentNode._children
        for (var i = 0, ii = siblings.length; i < ii; i++) {
            if (siblings[i] === this) return i
        }
    },

    /**
     * Empties children.
     */
    empty: function () {
        var children

        if (this._isExpandContext) {
            children = this._expandedChildren
            this._expandedChildren = []
        } else {
            children = this._children
            this._children = []
        }

        if (children) {
            for (var i = 0, ii = children.length; i < ii; i++) {
                if (children[i] instanceof BemNode) {
                    children[i]._unlink()
                }
            }
        }

        if (this._domNode) {
            while (this._domNode.firstChild) {
                this._domNode.removeChild(this._domNode.firstChild)
            }
        }

        return this
    },

    /**
     * Removes current node
     */
    remove: function (dontUnlink) {
        if (this._domNode) {
            this._domNode.parentNode.removeChild(this._domNode)
        }

        if (this._parentNode) {
            this._parentNode._children = this._parentNode._children.splice(this.index(), 1)
        }

        if (!dontUnlink) this._unlink()

        return this
    },

    /**
     * Appends new children. If there's no DOM yet,
     * appends to expandedChildren else appends to children
     * and renders its DOM.
     *
     * @children string|object Multiple argument
     */
    append: function () {
        for (var i = 0, ii = arguments.length; i < ii; i++) {
            var child = arguments[i]

            if (Array.isArray(child)) {
                this.append.apply(this, child)
                continue
            } else if (child instanceof BemNode) {
                child.parentNode(this)
                if (child._isElem) {
                    if (this._isBlock) {
                        child.parentBlock(this)
                    } else if (this._attr.context) {
                        child.parentBlock(this._parentBlock)
                    }
                }
            } else if (typeof child === 'number') {
                child = child.toString()
            }

            if (this._domNode && !this._isReplaceContext) {
                this._children.push(child)
                this._renderChildWithIndex(this._children.length-1)
            } else if (this._isExpandContext) {
                if (!this._expandedChildren) this._expandedChildren = []
                this._expandedChildren.push(child)
            } else {
                this._children.push(child)
            }
        }

        return this
    },

    /**
     * Appends node to the target. If current node belongs to another parent,
     * method removes it from the old context.
     *
     * @bemNode object Target
     */
    appendTo: function (bemNode) {
        this.remove(true)
        bemNode.append(this)

        return this
    },

    /**
     * Replaces current bemNode with the new
     */
    replaceWith: function (bemNode) {
        this._completeExpand()

        var parentNode = this._parentNode
        var siblingsAfter

        if (parentNode === bemNode) {
            parentNode = this._prevParentNode
        } else {
            siblingsAfter = parentNode._children.splice(this.index())
            siblingsAfter.shift()
        }

        parentNode._isReplaceContext = true
        parentNode.append(bemNode)
        parentNode._isReplaceContext = false

        if (siblingsAfter) {
            parentNode._children = parentNode._children.concat(siblingsAfter)
        }

        this._parentNode = null

        if (bemNode instanceof BemNode) {
            if (bemNode._isBlock) {
                bemNode._resetParentBlockForChildren()
            }
            bemNode.render()
        }
    },

    /**
     * Replaces current bemNode with the new wich implemets its declaration
     */
    implementWith: function (bemNode) {
        this._setDomNodeClasses()
        bemNode._implementedNode = this
        bemNode._mix = bemNode._mix.concat(this._domClasses)
        bemNode._defineUserMethods(this._name)
        this.replaceWith(bemNode)
    },

    /**
     * Filters text in children
     *
     * @return string
     */
    text: function () {
        var text = ''
        for (var i = 0, ii = this._children.length; i < ii; i++) {
            if (typeof this._children[i] === 'string') {
                text += this._children[i]
            }
        }

        return text
    },

    /**
     * Finds bemNodes and attributes by paths:
     * - nodeName1
     * - nodeName1/nodeName2
     * - nodeName1/
     *
     * @path   string Multiple argument: path to node or attribute
     * @return array  bemNodes collection
     */
    get: function () {
        if (arguments.length === 0) return this._children

        var collection = []

        for (var i = 0, ii = arguments.length; i < ii; i++) {
            var pathItems = arguments[i].split('/')

            for (var j = 0, jj = pathItems.length; j < jj; j++) {
                var pathItem = pathItems[j]

                if (j === 0) {
                    collection = this._filterChildNodes(pathItem)
                } else {
                    var prevCollection = collection
                    collection = []
                    for (var k = 0, kk = prevCollection.length; k < kk; k++) {
                        collection = collection.concat(
                            this._filterChildNodes.call(prevCollection[k], pathItem)
                        )
                    }
                }

                if (collection.length === 0) {
                    break
                }
            }
        }

        return collection
    },

    /**
     * Variation of get() method with current block forcing
     */
    getWithContext: function () {
        var children = this.get.apply(this, argumnets)
        for (var i = 0, ii = children.length; i < ii; i++) {
            if (children[i] instanceof BemNode) {
                children[i].parenBlock(this._parentBlock)
            }
        }
        return children
    },

    /**
     * Checks if there are any children
     *
     * @path string Multiple argument: path to node or attribute
     */
    has: function () {
        return this.get.apply(this, arguments).length > 0
    },

    /**
     * Set handler to call afted DOM-node inited
     *
     * @callback function Handler to call
     */
    afterDomInit: function (handler) {
        if (!this._domInited) {
            this._afterDomInitHandlers.push(handler)
        } else {
            handler.call(this)
        }

        return this
    },

    /**
     * Expands bemNode. Creates DOM-node and appends to the parent bemNode's DOM.
     * Also renders its children. Inits DOM declarations at the end.
     *
     * @parentDOMNode object Parent for the root node attaching
     */
    render: function (parentDOMNode) {
        this._expand()

        if (!parentDOMNode && !this._parentNode) {
            return this
        }

        if (!this._domNode) {
            this._domNode = document.createElement(this._tag)
            this._domNode.bemNode = this

            if (this._id !== '') {
                this._domNode.id = this._id
            }

            this._setDomNodeClasses()
            this._setDomNodeCSS()

            for (key in this._domAttr) {
                this._domNode.setAttribute(key, this._domAttr[key])
            }
        }

        if (parentDOMNode) {
            parentDOMNode.appendChild(
                this._domNode
            )
        } else {
            this._parentNode._domNode.appendChild(
                this._domNode
            )
        }

        for (var i = 0, ii = this._children.length; i < ii; i++) {
            this._renderChildWithIndex(i)
        }

        this._bemNodeIndex = Beast._bemNodes.length
        Beast._bemNodes.push(this)
        this._domInit()

        return this
    },

    /**
     * Gets HTML text for current node and its children.
     *
     * @return string
     */
    renderHTML: function () {
        var html = ''

        // Do some recursive routine here

        return html
    },

    /*
     * PRIVATE
     */

    /**
     * Recursive parent block setting
     *
     * @bemNode     object current node with children
     * @parentBlock object paren block reference
     */
    _setParentBlockForChildren: function (bemNode, parentBlock, forced) {
        for (var i = 0, ii = bemNode._children.length; i < ii; i++) {
            var child = bemNode._children[i]
            if (child instanceof BemNode && child._isElem) {
                if (!child._parentBlock || forced) {
                    child.parentBlock(parentBlock)
                } else {
                    this._setParentBlockForChildren(child, parentBlock)
                }
            }
        }
    },

    /**
     * Collects children by node name
     *
     * @name   string Child node name
     * @return array  Filtered children
     */
    _filterChildNodes: function (name) {
        var collection = []
        for (var i = 0, ii = this._children.length; i < ii; i++) {
            var child = this._children[i]
            if (
                child instanceof BemNode && (
                    name === ''
                    || name === child._nodeName
                    || child._implementedNode && name === child._implementedNode._nodeName
                )
            ) {
                collection.push(child)
            }
        }

        return collection
    },

    /**
     * Creates DOM-node for child with @index and appends to DOM tree
     *
     * @index number Child index
     */
    _renderChildWithIndex: function (index) {
        var child = this._children[index]

        if (child instanceof BemNode) {
            child.render()
        } else {
            this._domNode.appendChild(
                document.createTextNode(child)
            )
        }
    },

    /**
     * Builds expanded children tree to replace the main
     */
    _expand: function () {
        if (this._isExpanded) return

        var decl = Beast._decl[this._name]
        if (decl) {
            this._isExpandContext = true
            decl.expand.call(this)
            this._completeExpand()
            this._isExpandContext = false
        }
    },

    /**
     * Change children array to expanded children array
     * after node expanding
     */
    _completeExpand: function () {
        if (this._isExpandContext && this._expandedChildren) {
            this._children = this._expandedChildren
            this._expandedChildren = null
        }
        this._isExpanded = true
    },

    /**
     * Initial instructions for the DOM-element
     */
    _domInit: function () {
        var decl = Beast._decl[this._name]
        if (decl) {
            decl.domInit.call(this)
        }

        if (this._implementedNode && (decl = Beast._decl[this._implementedNode._name])) {
            decl.domInit.call(this)
        }

        this._domInited = true

        if (this._afterDomInitHandlers.length !== 0) {
            for (var i = 0, ii = this._afterDomInitHandlers.length; i < ii; i++) {
                this._afterDomInitHandlers[i].call(this)
            }
        }
    },

    /**
     * Call modifier change handlers
     *
     * @modName  string
     * @modValue string
     * @data     object Additional data for handler
     */
    _callModHandlers: function (modName, modValue, data) {
        var handlers

        if (this._modHandlers[modName]) {
            if (this._modHandlers[modName][modValue]) {
                handlers = this._modHandlers[modName][modValue]
            } else if (value === false && this._modHandlers[name]['']) {
                handlers = this._modHandlers[modName]['']
            } else if (value === '' && this._modHandlers[name][false]) {
                handlers = this._modHandlers[modName][false]
            }
        }

        if (handlers) {
            for (var i = 0, ii = handlers.length; i < ii; i++) {
                handlers[i].call(this, data)
            }
        }
    },

    /**
     * Exntends object property with default object
     *
     * @propertyName string
     * @defaults     object
     */
    _extendProperty: function (propertyName, defaults)
    {
        var actuals = this[propertyName]

        for (key in defaults) {
            if (typeof actuals[key] !== 'undefined' && actuals[key] !== '') {
                this[propertyName][key] = actuals[key]
            } else {
                this[propertyName][key] = defaults[key]
            }
        }

        return this
    },

    /**
     * Sets DOM classes
     */
    _setDomNodeClasses: function () {
        var className = this._name
        var value

        for (key in this._mod) {
            value = this._mod[key]
            if (value === '' || value === false) {
                continue
            }
            if (value === true) {
                className += ' ' + this._name + '_' + key
                continue
            }
            className += ' ' + this._name + '_' + key + '_' + value
        }

        for (var i = 0, ii = this._mix.length; i < ii; i++) {
            className += ' ' + this._mix[i]
        }

        this._domClasses = className.split(' ')

        if (this._domNode) {
            this._domNode.className = className
        }
    },

    /**
     * Sets DOM CSS
     */
    _setDomNodeCSS: function () {
        var css = ''

        for (name in this._css) {
            if (this._css[name] || this._css[name] === 0) {
                css += name + ':' + this._css[name] + ';'
            }
        }

        if (css !== '') this._domNode.setAttribute('style', css)
    },

    /**
     * Recursive setting parentBlock as this for child elements
     */
    _resetParentBlockForChildren: function () {
        for (var i = 0, ii = this._children.length; i < ii; i++) {
            var child = this._children[i]
            if (child instanceof BemNode && child._isElem) {
                child.parentBlock(this._parentBlock)
                child._resetParentBlockForChildren(this._parentBlock)
            }
        }
    },

    /**
     * Defines user's methods
     */
    _defineUserMethods: function () {
        var selector = arguments[0] || this._name
        var decl = Beast._decl[selector]

        if (!decl) return

        for (methodName in decl._userMethods) {
            this[methodName] = decl._userMethods[methodName]
        }
    },

    /**
     * Clears user's methods
     */
    _clearUserMethods: function () {
        if (this._name === '' || !Beast._decl[this._name]) return
        var userMethods = Beast._decl[this._name]._userMethods
        for (methodName in userMethods) {
            this[methodName] = null
        }
    },

    /**
     * Unlinks node from the common list of nodes
     */
    _unlink: function () {
        if (this._bemNodeIndex >= 0) {
            Beast._bemNodes[this._bemNodeIndex] = null
        }
    }
}

Beast.BemNode = BemNode

var cssPxProperty = {
    height:1,
    width:1,
    left:1,
    right:1,
    bottom:1,
    top:1,
    'line-height':1,
    'font-size':1
}

})();
