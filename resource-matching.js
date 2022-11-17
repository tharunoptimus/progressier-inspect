function ResourceMatching(){
	let that = this;
	this.methods =  ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "CONNECT", "TRACE", "PATCH"];
	this.lastStrategy = {name: "All other resources", strat: "lbd", disabled: true};
	this.getLastStrategy = function(){
		return JSON.parse(JSON.stringify(that.lastStrategy));
	}
	
	this.trimUrl = function(url){
		let trimmed = (new URL(url).origin + new URL(url).pathname).toLowerCase().trim();
		if (trimmed[trimmed.length - 1] === "/"){
			trimmed = trimmed.slice(0, trimmed.length -1);
		}
		return trimmed;
	}
	
	this.urlsMatch = function(url1, url2){
		try {
			if (url1.includes("*")){
				let regexed = url1.toLowerCase().trim().replace(/\*/g, "[^ ]*");
				let base2 = that.trimUrl(url2);
				return new RegExp(regexed).test(base2);
			}
			else {
				let base1 = that.trimUrl(url1);
				let base2 = that.trimUrl(url2);
				return base1 === base2;
			}
		}
		catch(err){
			console.log(err);
			return false;
		}
	}
	
	this.myDomain = function(){
		try {
			return app.page.current.data.domain;
		}
		catch(error){
			try {
				return self.location.origin;
			}
			catch(error){
				return "mydomain.com";
			}
		}
	}
	
	this.hasNoStore = function(headers){
		if (!headers || typeof headers !== "object"){return false;}
		let cacheControl = headers["cache-control"] || headers["Cache-Control"] || headers["Cache-control"] || "";
		if (cacheControl.includes('no-store') || cacheControl.includes('no-cache') || cacheControl === "no-cache" || cacheControl === "no-store"){
			return true;
		}
		return false;
	}
	
	this.defaultStrategies = [
		{name: "Resources to keep up-to-date", strat: "nto", filters:[]},
		{name: "Font files", strat: "swr", filters: [
			[{field: "method", comparator: "==", value:"GET"}],[{field: "url", comparator: "(-=)", value: "https://fonts.googleapis.com"},{field: "url", comparator: "(-=)", value: "https://fonts.gstatic.com"},{field: "url", comparator: "(-)", value: "font-awesome"}, {field: "type", comparator: "==", value: "font"}]
		]},
	];	

	this.stringIncludesAnyInArray = function(array, string){
		let found = false;
		array.forEach(function(item){
			if (!string){return;}
			if (string.includes(item)){ found = true; }
		});
		return found;
	}
	
	this.urlEndsWithThisFileExtension = function(url, extension){
		try {
			let pathname = new URL(url).pathname;
			let split = pathname.split('.');
			return split[split.length - 1] === extension;
		}
		catch(error){
			return false;
		}
	}
			
	this.mimes = [
		{t: "tracking", name: "Tracking", icon: "feather feather-activity", color: "#ff8282", fn: function(resource){
			if (that.stringIncludesAnyInArray(["google-analytics.com/j/collect", "ads/ga-audience", "/pagead/", "analytics.twitter.com", "google-analytics.com/collect", ".googlesyndication.com/", "g.doubleclick.net/j", "qualtrics.com", "gtag/js", "connect.facebook.net", "logx.optimizely.com"], resource.url)){return true;}
			return false;
		}},
		{t: "css", name: "Stylesheet", sizeWarning: 3000000, warningWording: `This is quite a big stylesheet. Consider breaking it down into smaller files and removing unused CSS.`, color: "#ffc3fd", icon: "fa fa-adjust", fn: function(resource){
			if (that.urlEndsWithThisFileExtension(resource.url, "css")){return true;}
			if (resource.mime === "text/css" || resource.destination === "style"){return true;}
			return false;
		}},
		{t: "js", name: "Script", sizeWarning: 15000000, warningWording: `That is a big Javascript file. Consider dividing it in smaller files to help your app load faster.`, color: "#ffc3fd", icon: "fa fa-cog", fn: function(resource){
			if (that.urlEndsWithThisFileExtension(resource.url, "js")){return true;}
			if (resource.destination === "script"){return true;}
			if (["application/javascript", "application/typescript", "text/javascript", "text/typescript"].includes(resource.mime)){return true;}
			return false;
		}},
		{t: "font", name: "Font", color: "#ffc3fd", icon: "fa fa-font", fn: function(resource){
			let mime = resource.mime;
			if (mime.includes("font/")){return true;}
			if (resource.destination === "font"){return true;}
			if (that.stringIncludesAnyInArray([".woff2", ".woff", ".eot", ".ttf"], resource.url)){return true;}
			return false;
		}},
		{t: "document", name: "Document", icon: "fa fa-file-text-o", color: "#aff8ff", fn: function(resource){
			if (that.urlEndsWithThisFileExtension(resource.url, "html")){return true;}
			if (resource.destination === "document"){return true;}
			if (resource.mime === "text/html" || resource.mime === "application/xhtml+xml"){return true;}
			return false;
		}},
		{t: "image", name: "Image", sizeWarning: 1000000, warningWording: `This image is quite large. Consider resizing it. Smaller images help your app load quicker and improves SEO.`, icon: "feather feather-image", color: "#90ffad", fn: function(resource){
			if (resource.destination === "image"){return true;}
			if (resource.mime.includes("image/")){return true;}
			return false;
		}},	
		{t: "audio", name: "Audio", icon: "feather feather-headphones", color: "#90ffad", fn: function(resource){
			if (resource.destination === "audio" || resource.destination === "audioworklet"){return true;}
			if (resource.mime.includes("audio/")){return true;}
			return false;
		}},
		{t: "video", name: "Video", icon: "feather feather-film", color: "#90ffad", fn: function(resource){
			if (resource.destination === "video"){return true;}
			if (resource.mime.includes("video/")){return true;}
			return false;
		}},
		{t: "json", name: "JSON", sizeWarning: 2000000, warningWording: `This resource returns a pretty big chunk of data. Consider refactoring your application so that it only requests data when it needs it.`, color: "#99d9ff", icon: "fa fa-code", fn: function(resource){
			if (that.urlEndsWithThisFileExtension(resource.url, "json")){return true;}
			if (resource.mime === "application/json"){return true;}
			return false;
		}},
		{t: "xml", name: "XML", color: "#99d9ff", icon: "fa fa-code", fn: function(resource){
			if (that.urlEndsWithThisFileExtension(resource.url, "xml")){return true;}
			if (resource.mime === "application/xml"){return true;}
			return false;
		}},
		{t: "pdf", name: "PDF", icon: "fa fa-file-pdf-o", color: "#ffadad", fn: function(resource){
			if (that.urlEndsWithThisFileExtension(resource.url, "pdf")){return true;}
			if (resource.mime === "application/pdf"){return true;}
			return false;
		}},
		{t: "archive", name: "Archive", icon: "fa fa-file-zip-o", color: "#ffadad", fn: function(resource){
			if (that.urlEndsWithThisFileExtension(resource.url, "rar")){return true;}
			if (that.urlEndsWithThisFileExtension(resource.url, "zip")){return true;}
			if (["application/zip", "application/x-7z-compressed", "application/x-rar-compressed"].includes(resource.mime)){return true;}
			return false;
		}},
		{t: "csv", name: "CSV", color: "#ffadad", icon: "fa fa-table", fn: function(resource){
			if (that.urlEndsWithThisFileExtension(resource.url, "csv")){return true;}
			if (resource.mime === "text/csv"){return true;}
		}},
		{t: "preflight", name: "Preflight", color: "var(--tag)", fn: function(resource){ return resource.mime === "OPTIONS"; }},
		{t: "unknown", name: "Unknown", color: "var(--tag)", fn: function(){return true;}},
	];	
	
	
	this.getHttpMethodOptions = function(){
		let opts = [];
		that.methods.forEach(function(o){
			opts.push({value: o, name: o, checkbox: "var(--dark)", color: "transparent", round: true});
		});
		return opts;
	};

	this.getMimeTypesOptions = function(){
		let opts = [];
		that.mimes.forEach(function(t){
			opts.push({value: t.t, name: t.name, checkbox: "var(--dark)", color: "transparent", round: true});
		});
		return opts;
	};
	
	this.transformMimeValue = function(val){
		let types = that.mimes;
		let type = types.find(o => o.t === val) || types.find(o => o.name === val) || types[0];
		return type.name;
	};

	this.fields = [
		{name: "Method", value: "method", checkbox: "var(--dark)", color: "transparent", round: true, comparators: ["==", "!=",], options: that.getHttpMethodOptions(), extractValue: function(resource){return resource.method;}},
		{name: "URL", value: "url", checkbox: "var(--dark)", color: "transparent", round: true, comparators: ["(-)", "(!-)", "==", "!=", "(-=)", "(=-)"], extractValue: function(resource){return resource.url;}},
		{name: "Type", value: "type", checkbox: "var(--dark)", color: "transparent", round: true, comparators: ["==", "!="], options: that.getMimeTypesOptions(), transformValue: that.transformMimeValue, extractValue: function(resource){return that.mimes[resource.mimeIndex].t;}},
	];
	
	this.comparators = [
		{value: "==", name: "is", test: function(resourceValue, definedValue){return resourceValue === definedValue;}},
		{value: "!=", name: "is not", test: function(resourceValue, definedValue){return resourceValue === definedValue ? false : true;}},
		{value: "(-)", name: "contains" , test: function(resourceValue, definedValue){return resourceValue.includes(definedValue);}},
		{value: "(!-)", name: "does not contain", test: function(resourceValue, definedValue){return resourceValue.includes(definedValue) ? false : true;}},
		{value: "(-=)", name: "starts with", test: function(resourceValue, definedValue){return resourceValue.startsWith(definedValue);}},
		{value: "(=-)", name: "end with", test: function(resourceValue, definedValue){return resourceValue.endWith(definedValue);}},
	];	
	
	this.strategies = [
		{id: "swr", name: "Stale-While-Revalidate", type: "cache", customize: true, usecache: true, cachefirst: true, revalidate: true, color: "var(--txthighlight)", dark: true, icon: "feather feather-zap", explanation: "With this strategy, resources are first served from the cache — making them load nearly instantly. A call is also simultaneously made to the server to acquire the most up-to-date version of the resource and save it in cache."},
		{id: "cfr", name: "Cache First", type: "cache", customize: true, usecache: true, cachefirst: true, revalidate: false, color: "var(--red)", explanation: "With this strategy, once a resource is in the cache, it will no longer be updated. Make sure that you have your own mechanism for updating resources (e.g. appending a version number to the URL of a resource when it changes). Or use only with resources that you're sure will never change.", icon: "fa fa-exclamation-triangle", dark: true,},
		{id: "ntf", name: "Network First", type: "cache", customize: true, usecache: true, cachefirst: false, revalidate: false, color: "var(--dark)", icon: "feather feather-server", explanation: "With this strategy, resources are requested from the network. If the network can't successfully provide a resource (e.g. because you're offline), then the last-cached version of the resource will be used instead."},
		{id: "nto", name: "Network Only", type: "network", customize: true, usecache: false, cachefirst: false, revalidate: false, color: "var(--dark)", icon: "fa fa-wifi", explanation: "With this strategy, resources will not be cached at all, forcing all resources to be retrieved from the network. If the network can't provide a resource, an error will be thrown."},
		{id: "lbd", name: "Let Browser Decide", type: "none", customize: false, usecache: false,  cachefirst: false, revalidate: false, color: "#dddddd", icon: "feather feather-help-circle", explanation: "This is the default strategy. It lets the browser decide on its own what to do with resources.", disabled: true},
	];
	
	this.match = function(resource, clauses){
		let matched = false;
		clauses.forEach(function(clause){
			if (matched){return;}
			let field = that.fields.find(o => o.value === clause.field);
			let resourceValue = (field.extractValue(resource) || "").toLowerCase();
			let definedValue = (clause.value||"").toLowerCase();
			let comparator = that.comparators.find(o => o.value === clause.comparator);
			try {
				let valuesMatch = comparator.test(resourceValue, definedValue);
				if (valuesMatch){matched = true;}
			} catch(err){}
		});
		return matched;
	};
}