package router

import (
	"embed"
	"net/http"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/controller"
	"github.com/QuantumNous/new-api/middleware"
	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

const geoLanguageCookie = "navtoai_geo_language"

func languageForCountry(country string) string {
	switch strings.ToUpper(strings.TrimSpace(country)) {
	case "CN":
		return "zh-CN"
	case "TW", "HK", "MO":
		return "zh-TW"
	case "JP":
		return "ja"
	case "KR":
		return "ko"
	case "":
		return ""
	default:
		return "en"
	}
}

func suggestLanguageByCountry(c *gin.Context) {
	language := languageForCountry(c.GetHeader("CF-IPCountry"))
	if language == "" {
		return
	}

	secure := c.Request.TLS != nil || strings.EqualFold(c.GetHeader("X-Forwarded-Proto"), "https")
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(geoLanguageCookie, language, 86400, "/", "", secure, false)
	c.Header("X-NavtoAI-Language", language)
}

func SetWebRouter(router *gin.Engine, buildFS embed.FS, indexPage []byte) {
	router.Use(gzip.Gzip(gzip.DefaultCompression))
	router.Use(middleware.GlobalWebRateLimit())
	router.Use(middleware.Cache())
	router.Use(suggestLanguageByCountry)
	router.Use(static.Serve("/", common.EmbedFolder(buildFS, "web/dist")))
	router.NoRoute(func(c *gin.Context) {
		c.Set(middleware.RouteTagKey, "web")
		if strings.HasPrefix(c.Request.RequestURI, "/v1") || strings.HasPrefix(c.Request.RequestURI, "/api") || strings.HasPrefix(c.Request.RequestURI, "/assets") {
			controller.RelayNotFound(c)
			return
		}
		c.Header("Cache-Control", "no-cache")
		c.Data(http.StatusOK, "text/html; charset=utf-8", indexPage)
	})
}
