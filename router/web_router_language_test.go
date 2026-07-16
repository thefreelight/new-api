package router

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestLanguageForCountry(t *testing.T) {
	tests := map[string]string{
		"CN": "zh-CN",
		"cn": "zh-CN",
		"TW": "zh-TW",
		"HK": "zh-TW",
		"MO": "zh-TW",
		"JP": "ja",
		"KR": "ko",
		"US": "en",
		"DE": "en",
		"":   "",
	}

	for country, expected := range tests {
		if actual := languageForCountry(country); actual != expected {
			t.Fatalf("languageForCountry(%q) = %q, want %q", country, actual, expected)
		}
	}
}

func TestSuggestLanguageByCountry(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(suggestLanguageByCountry)
	router.GET("/", func(c *gin.Context) {
		c.Status(http.StatusNoContent)
	})

	request := httptest.NewRequest(http.MethodGet, "https://example.com/", nil)
	request.Header.Set("CF-IPCountry", "KR")
	request.Header.Set("X-Forwarded-Proto", "https")
	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, request)

	if got := recorder.Header().Get("X-NavtoAI-Language"); got != "ko" {
		t.Fatalf("X-NavtoAI-Language = %q, want %q", got, "ko")
	}

	cookies := recorder.Result().Cookies()
	if len(cookies) != 1 {
		t.Fatalf("got %d cookies, want 1", len(cookies))
	}
	if cookies[0].Name != geoLanguageCookie || cookies[0].Value != "ko" {
		t.Fatalf("unexpected language cookie: %#v", cookies[0])
	}
	if !cookies[0].Secure || cookies[0].HttpOnly {
		t.Fatalf("unexpected cookie flags: secure=%v httpOnly=%v", cookies[0].Secure, cookies[0].HttpOnly)
	}
}
