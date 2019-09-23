<svg viewBox="0 0 2200 1200" id="zlog" x="0" y="0" version="1.1" xsl:version="1.0"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"  
 xmlns="http://www.w3.org/2000/svg">

<rect x="0" y="0" width="1340" height="1200" fill="rgba(255,255,255,0.3)" />

<image x="1140" y="50" width="144" height="144" href="static/close.svg"></image>

<xsl:for-each select="roll/dayquantum">
  <xsl:sort select="@date" order="descending" data-type="number"/>

  <xsl:variable name="y" select="(position() * 178) - 96" />    
  
  <text fill="rgba(15,94,173,1)" font-size="48" font-weight="900" >      
    <xsl:attribute name="x"><xsl:value-of select="80" /></xsl:attribute>            
    <xsl:attribute name="y"><xsl:value-of select="$y - 40" /></xsl:attribute>        
    <xsl:attribute name="transform">rotate(90, 80, <xsl:value-of select="$y - 40 " />)</xsl:attribute>    
    <xsl:value-of select="substring(@date,1,5)" />        
  </text>
  <text fill="#fff" font-size="72">      
    <xsl:attribute name="x"><xsl:value-of select="120" /></xsl:attribute>            
    <xsl:attribute name="y"><xsl:value-of select="$y + 36" /></xsl:attribute>        
    <xsl:value-of select="sum(item/@value)" />
  </text>
  
  <xsl:for-each select="item">     
    <xsl:sort select="@value" order="descending" data-type="number"/>
    <rect fill="rgba(15,94,173,1)" >      
      <xsl:attribute name="x"><xsl:value-of select="200 + (sum(preceding-sibling::item/@value) * 16)" /></xsl:attribute>            
      <xsl:attribute name="y"><xsl:value-of select="$y - 48" /></xsl:attribute>        
      <xsl:attribute name="width"><xsl:value-of select="@value * 16" /></xsl:attribute>            
      <xsl:attribute name="rx">10</xsl:attribute>        
      <xsl:attribute name="height">48</xsl:attribute>        
    </rect>
    <g font-family="sans-serif">
    <text fill="#fff" font-size="20" text-anchor="middle">      
      <xsl:attribute name="x">
      <xsl:value-of select="200 + (sum(preceding-sibling::item/@value) * 16) + ((@value * 16) div 2)" /></xsl:attribute>           
      <xsl:attribute name="y"><xsl:value-of select="$y - 20" /></xsl:attribute>          
      <xsl:value-of select="@value" />
    </text>       
    <text fill="#fff" font-size="18" text-anchor="start">      
      <xsl:attribute name="x"><xsl:value-of select="200 + (sum(preceding-sibling::item/@value) * 16) + ((@value * 16) div 2)" /></xsl:attribute>            
      <xsl:attribute name="y"><xsl:value-of select="$y" /></xsl:attribute>          
      <xsl:attribute name="transform">rotate(90, <xsl:value-of select="200 + (sum(preceding-sibling::item/@value) * 16) + ((@value * 16) div 2)" />, <xsl:value-of select="$y" />)</xsl:attribute>            
      <xsl:value-of select="@product" />
    </text>
    </g>
  </xsl:for-each>    
</xsl:for-each>  
</svg>