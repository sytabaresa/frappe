// website_script.js
{% if javascript -%}{{ javascript }}{%- endif %}

{% if google_analytics_id -%}
// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
// End Google Analytics
{%- endif %}

function start_google_anayltics(fieldObject) {
	{% if google_analytics_id -%}
	ga('create', '{{ google_analytics_id }}', fieldObject);
	ga('send', 'pageview');
	{%- endif %}
}

{% if show_cookie_consent -%}
frappe.require([
	'/assets/frappe/node_modules/cookieconsent/build/cookieconsent.min.js',
	'/assets/frappe/node_modules/cookieconsent/build/cookieconsent.min.css'
], function() {
	var style = getComputedStyle(document.body);
	window.cookieconsent.initialise({
		theme: "classic",
		position: '{{ cookie_consent_position }}',
		type: '{{ cookie_consent_type }}',
		layout: 'basic-header',
		content: {
			header: __('This website uses cookies'),
			message: __('We use cookies to ensure you get the best experience on our website.'),
			dismiss: __('Got it!'),
			allow: __('Allow cookies'),
			deny: __('Decline'),
			link: __('Learn more'),
			href: '{{ cookie_policy_uri }}',
			close: '&#x274c',
			target: '_blank',
			policy: __('Cookie Policy')
		},
		palette: {
			popup: {
				background: style.getPropertyValue('--light'),
			},
			button: {
				background: style.getPropertyValue('--primary')
			}
		},
		onInitialise: function (status) {
			var type = this.options.type;
			var didConsent = this.hasConsented();
			if (type == 'opt-in' && didConsent) {
				// enable cookies
				start_google_anayltics('auto');
			}
			if (type == 'opt-out' && !didConsent) {
				// disable cookies
				start_google_anayltics({'storage': 'none'});
			}
		},
	});
})
{% else %}
start_google_anayltics('auto');
{%- endif %}

{% if enable_view_tracking %}
	if (navigator.doNotTrack != 1 && !window.is_404) {
		frappe.ready(() => {
			let browser = frappe.utils.get_browser();
			frappe.call("frappe.website.doctype.web_page_view.web_page_view.make_view_log", {
				path: location.pathname,
				referrer: document.referrer,
				browser: browser.name,
				version: browser.version,
				url: location.origin,
				user_tz: Intl.DateTimeFormat().resolvedOptions().timeZone
			})
		})
	}
{% endif %}