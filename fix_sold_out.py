import os
import re

files = [
    'series-minifigures.html',
    'series-editions.html',
    'series-landmark.html',
    'series-art.html',
    'series-animation.html',
    'series-technic.html',
    'series-rides.html',
    'series-music.html'
]

for filename in files:
    filepath = filename
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # Regex to find card blocks and replace disabled sold-out buttons inside them
    # A card block usually looks like:
    # <div class="landmark-card ..."> ... <h3 class="card-name">NAME</h3> ... <button class="btn-sold-out" disabled>일시품절</button> ... </div>
    
    # Let's write a robust regex parser or custom state machine to locate each card and find the name
    # We will search for all <div class="landmark-card ...">...</div> blocks
    card_pattern = re.compile(r'(<div class="landmark-card hoverable">[\s\S]*?<\/div>\s*<\/div>)')
    
    def replace_sold_out_in_card(match):
        card_content = match.group(1)
        if 'btn-sold-out' in card_content:
            # Extract name
            name_match = re.search(r'<h3 class="card-name">(.*?)</h3>', card_content)
            if name_match:
                product_name = name_match.group(1).strip()
                # Remove HTML tags inside name if any
                product_name = re.sub(r'<[^>]*>', '', product_name)
                
                # Replace sold-out button with active cart button
                cart_button = f'<button class="btn-cart-add hoverable" onclick="addToCart(\'{product_name}\')">\n                            <i class="fa-solid fa-bag-shopping"></i> 장바구니 담기\n                        </button>'
                
                # Replace
                updated_card = card_content.replace('<button class="btn-sold-out" disabled>일시품절</button>', cart_button)
                # Also fallback if text is different
                updated_card = re.sub(r'<button class="btn-sold-out"[^>]*>.*?</button>', cart_button, updated_card)
                print(f"  Converted sold-out card '{product_name}' in {filename}")
                return updated_card
        return card_content

    new_html = card_pattern.sub(replace_sold_out_in_card, html)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f"Successfully processed {filename}")
