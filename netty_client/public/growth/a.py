from PIL import Image

# 이미지 열기
img = Image.open("growth_006.png") # 투명 배경이므로 .png 권장

# 크롭 영역 계산 (left, top, right, bottom)
# (2048 - 1024) / 2 = 512
left = 512
top = 512
right = 1536
bottom = 1536

# 이미지 크롭
cropped_img = img.crop((left, top, right, bottom))

# 저장
cropped_img.save("growth_06.png")